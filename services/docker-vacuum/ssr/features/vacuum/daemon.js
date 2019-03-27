import { logVerbose, logError, logDebug } from 'services/logger'
import { dockerSystemPrune } from 'lib/docker-system-prune'
import { dockerImageRetain } from 'lib/docker-image-retain'
import { dockerImageBusyList } from 'lib/docker-image-busy-list'

const loop = async () => {
    const next = () => {
        logVerbose(`vacuum daemon, next loop in ${loop.settings.interval}`)
        setTimeout(loop, loop.settings.interval)
    }

    try {
        // delete dangling images
        logVerbose('System prune for dangling...')
        await dockerSystemPrune()

        // Find out images related to running containers
        const busyImages = (await dockerImageBusyList()).map(image => image.uuid)

        // delete images with retentions
        logVerbose('Delete images with retention...')
        await dockerImageRetain(loop.settings.rules, busyImages)
    } catch (err) {
        logError(`Could not complete the loop - ${err.message}`)
        logDebug(err)
    }

    next()
}

// Start interface
export const start = ({ vacuum }) => {
    loop.settings = vacuum
    loop()
}
