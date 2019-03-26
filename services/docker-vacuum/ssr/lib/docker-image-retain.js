import { dockerImages } from './docker-images'

export const findDistinctImages = (lines) => {
    const images = []

    lines.forEach(line => {
        if (!images.includes(line.repository)) {
            images.push(line.repository)
        }
    })

    return images
}

export const matchRules = (rules, lines) => {
    const results = []

    rules.forEach(rule => {
        const regexp = new RegExp(rule.match)

        lines.forEach(line => {
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


export const dockerImageRetain = async (rules) => {
    const images = await dockerImages()
    const uniques = findDistinctImages(images)
    const todos = matchRules(rules, uniques)
    console.log(todos)
    console.log('?????????????????????????')

    todos.forEach(todo => {
        const tags = images.filter(image => image.repository === todo.repository)
        console.log(todo.repository)
        console.log(tags.map(tag => `${tag.uuid} ${tag.tag} ${tag.ctime.string}`))
        console.log('=====')
    })

}