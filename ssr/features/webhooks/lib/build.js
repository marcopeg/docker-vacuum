import ms from 'ms'
import path from 'path'
import fs from 'fs-extra'

import { gitClone } from './git-clone'
import { gitCommit } from './git-commit'
import { gitPush } from './git-push'
import { gitPull } from './git-pull'
import { gitIdentity } from './git-identity'
import { yarn } from './yarn'
import { fsEmptyDir } from './fs-empty-dir'
import { fsMoveFiles } from './fs-move-files'

export const build = async (config, log = () => {}) => {
    const start = new Date()
    log('build start')

    // Fake build - for development
    // await new Promise(resolve => setTimeout(resolve, 5000))
    // log('build finish')
    // return { elapsed: 5000, elapsedStr: '5s' }
    // console.log(config)
    // throw new Error('nooo')

    const originPath = `${config.config.data}/origin/${config.origin.repository}/${config.origin.branch}`
    const targetPath = `${config.config.data}/target/${config.target.repository}/${config.target.branch}`

    

    /**
     * CLONE ORIGIN
     */

    if (config.config.cleanOrigin) {
        log('=======================\n\n')
        log('## Cleaning origin repo...\n')
        await fs.remove(originPath)
    }

    const originExists = await fs.exists(originPath)
    if (!originExists) {
        log('=======================\n\n')
        log('## Cloning origin repo...\n')
        await fs.ensureDir(originPath)
        await gitClone({
            ...config.auth,
            ...config.origin,
            target: originPath,
        }, { log })
    } else {
        log('=======================\n\n')
        log('## Pulling origin repo...\n')
        try {
            await gitPull({
                ...config.origin,
                target: originPath,
            }, { log })
        } catch (err) {
            await fs.remove(originPath)
            await gitClone({
                ...config.auth,
                ...config.origin,
                target: originPath,
            }, { log })
        }
    }



    /**
     * BUILD
     */

    log('=======================\n\n')
    log('## Installing dependencies...\n')
    await yarn('install', originPath, { log })
    
    log('=======================\n\n')
    log('## Building the project...\n')
    await yarn(config.build.script, originPath, { log })



    /**
     * CLONE TARGET
     */

    if (config.config.cleanTarget) {
        log('=======================\n\n')
        log('## Cleaning target repo...\n')
        await fs.remove(targetPath)
    }

    const targetExists = await fs.exists(targetPath)
    if (!targetExists) {
        log('=======================\n\n')
        log('## Cloning target repo...\n')
        await gitClone({
            ...config.auth,
            ...config.target,
            target: targetPath,
        }, { log })
    } else {
        log('=======================\n\n')
        log('## Pulling target repo...\n')
        try {
            await gitPull({
                ...config.target,
                target: targetPath,
            }, { log })
        } catch (err) {
            await fs.remove(targetPath)
            await gitClone({
                ...config.auth,
                ...config.target,
                target: targetPath,
            }, { log })
        }
    }



    /**
     * MOVE BUILD FILES
     */

    log('=======================\n\n')
    log('## Moving artifacts...\n')
    await fsEmptyDir(targetPath, [ '.git' ])
    await fsMoveFiles(path.join(originPath, config.build.target), targetPath, [ '.git' ])



    /**
     * PUBLISH
     */

    log('=======================\n\n')
    log('## Publishing...\n')
    await fs.writeJSON(path.join(targetPath, 'gatsby-deploy.json'), {
        lastDeploy: new Date(),
        duration: new Date() - start,
    })
    await gitIdentity(config.auth)
    await gitCommit(targetPath, `publish ${(new Date()).toISOString()}`)
    await gitPush({
        ...config.auth,
        ...config.target,
        target: targetPath,
    }, { log })



    /**
     * CLEANUP
     */

    if (config.config.cleanOrigin) {
        log('=======================\n\n')
        log('## Cleaning origin repo...\n')
        await fs.remove(originPath)
    }

    if (config.config.cleanTarget) {
        log('=======================\n\n')
        log('## Cleaning target repo...\n')
        await fs.remove(targetPath)
    }
    

    const elapsed = new Date() - start
    const elapsedStr = ms(elapsed)

    log('=======================\n\n')
    log(`## Build went through in ${elapsedStr}\n`)

    return {
        elapsed,
        elapsedStr,
    }
}
