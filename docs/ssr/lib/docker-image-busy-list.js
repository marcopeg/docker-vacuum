import { exec } from './exec'
import { dockerImages } from './docker-images'

export const dockerImageBusyList = async () => {
    const busyImages = (await exec(`docker ps --format "{{.Image}}"`))
        .trim()
        .split('\n')

    // filter out with specific tag or "latest"
    return (await dockerImages())
        .filter(({ repository, tag }) => (
            busyImages.indexOf(`${repository}:${tag}`) !== -1
            || busyImages.indexOf(`${repository}:latest`) !== -1
            || busyImages.indexOf(repository) !== -1
        ))
}
    
