import { logVerbose, logError } from 'services/logger'
import { dockerImages } from './docker-images'
import { dockerRmi } from './docker-rmi'

export const findDistinctImages = (lines) => {
    const images = []

    lines.forEach(line => {
        if (!images.includes(line.repository)) {
            images.push(line.repository)
        }
    })

    return images
}

export const matchRules = (rules, repositories) => {
    const results = []

    rules.forEach(rule => {
        const regexp = new RegExp(rule.match)

        repositories.forEach(line => {
            if (line.match(regexp)) {
                results.push({
                    repository: line,
                    retain: rule.retain,
                })
            }
        })
    })

    return results
}

export const mergeRules = (matches, images) =>
    matches
        .map(match => ({
            ...match,
            images: images
                .filter(image => image.repository === match.repository),
        }))
        .filter(rule => rule.images.length > rule.retain)

export const getUnretainedImages = (images, retain = 1) => {
    const ids = []
    const unique = images.filter(image => {
        if (!ids.includes(image.uuid)) {
            ids.push(image.uuid)
            return true
        }
    })

    unique.sort((a, b) => b.ctime.date - a.ctime.date)

    for (let i = 0; i < retain; i++) {
        unique.shift()
    }

    return unique
}

export const getObsoleteImages = (images, rules) => {
    const repositories = findDistinctImages(images)
    const matches = matchRules(rules, repositories)
    const targets = mergeRules(matches, images)

    return targets.reduce((acc, curr) => {
        return [
            ...acc,
            ...getUnretainedImages(curr.images, curr.retain),
        ]
    }, [])
}

export const dockerImageRetain = async (rules) => {
    const images = await dockerImages()
    const obsolete = getObsoleteImages(images, rules)

    const res = {
        deleted: [],
        errors: [],
    }
    for (const image of obsolete) {
        try {
            logVerbose(`Deleting: ${image.repository}:${image.tag} - ${image.uuid}`)   
            const output = await dockerRmi(image.uuid)
            res.deleted.push({
                ...image,
                output,
            })
        } catch (error) {
            logError(`Failed to delete ${image.repository}:${image.tag} (${image.uuid}) - ${error.message}`)
            res.errors.push({
                ...image,
                error,
            })
        }
    }
}