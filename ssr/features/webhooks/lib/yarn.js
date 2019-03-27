import { spawn } from './spawn'

export const yarn = (cmd, targetPath, options = {}) =>
    spawn(`yarn ${cmd}`, {
        ...options,
        cwd: targetPath,
    })
    