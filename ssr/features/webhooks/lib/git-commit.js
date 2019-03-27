import { exec } from './exec'

export const gitCommit = async (target, message = 'commit') => {
    const options = {
        cwd: target,
    }

    await exec('git add .', options)
    await exec(`git commit -m "${message}"`, options)
}