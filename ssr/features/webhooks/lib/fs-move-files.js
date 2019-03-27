import fs from 'fs-extra'
import path from 'path'

export const fsMoveFiles = async (origin, target, keep = []) => {
    const allFiles = await fs.readdir(origin)
    const toMove = allFiles.filter(file => !keep.includes(file))
    return Promise.all(toMove.map(file => fs.move(path.join(origin, file), path.join(target, file))))
}
