import bytes from 'bytes'
import moment from 'moment'
import { exec } from './exec'

const separator = '-:@:-'

export const parseLine = (line) => {
    const [ uuid, digest, repository, tag, lifetime, ctime, size ] = line.split(separator)
    return {
        repository,
        tag,
        uuid,
        digest,
        lifetime,
        ctime: {
            string: ctime,
            date: moment(ctime, 'YYYY-MM-DD hh:mm:ss'),
        },
        size: {
            string: size,
            bytes: bytes(size),
        },
    }
}

export const parseResponse = (res) => {
    const lines = res.trim().split('\n')
    return lines.map(parseLine)
}

export const dockerImages = async () => {
    const res = await exec(`docker images --format "{{.ID}}${separator}{{.Digest}}${separator}{{.Repository}}${separator}{{.Tag}}${separator}{{.CreatedSince}}${separator}{{.CreatedAt}}${separator}{{.Size}}"`)
    return parseResponse(res)
}
