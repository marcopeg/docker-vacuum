import { spawn } from './spawn'

export const gitPush = async (git, options) => {
    const { username, password, repository, target, branch } = git

    const cmdOptions = {
        ...options,
        cwd: target,
    }

    const cmd = [
        `git push`,
        `https://${username}:${password}@github.com/${repository}.git`,
        branch,
    ].join(' ')

    return spawn(cmd, cmdOptions)
}