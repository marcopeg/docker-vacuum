import { spawn } from './spawn'

export const gitClone = (git, options) => {
    const { username, password, repository, target, branch } = git

    const cmd = [
        `git clone`,
        `--single-branch --branch ${branch}`,
        `https://${username}:${password}@github.com/${repository}.git`,
        target,
    ].join(' ')

    return spawn(cmd, options)
}