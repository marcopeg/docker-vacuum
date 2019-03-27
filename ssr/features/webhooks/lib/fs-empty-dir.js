import fs from 'fs-extra'
import path from 'path'
import exec from './exec'

export const fsEmptyDir = async (target, keep = []) => {
    try {
        await exec('rm -rf node_modules', { cwd: target })
    } catch (err) {}

    const allFiles = await fs.readdir(target)
    const toDelete = allFiles.filter(file => !keep.includes(file))
    return Promise.all(toDelete.map(file => fs.remove(path.join(target, file))))
}