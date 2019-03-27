import { logVerbose, logError, logDebug } from 'services/logger'
import { dockerSystemPrune } from 'lib/docker-system-prune'
import { dockerImageRetain } from 'lib/docker-image-retain'

const loop = async () => {
    console.log('loop', loop.settings)

    const next = () => {
        console.log('go next loop')
        // setTimeout(loop, 1000)
    }

    try {
        // delete dangling images
        logVerbose('System prune for dangling...')
        await dockerSystemPrune()

        // Find out images related to running containers

        // delete images with retentions
        logVerbose('Delete images with retention...')
        await dockerImageRetain(loop.settings.rules)
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
