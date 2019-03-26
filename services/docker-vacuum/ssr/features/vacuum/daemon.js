import { dockerImagePrune } from 'lib/docker-image-prune'
import { dockerImageRetain } from 'lib/docker-image-retain'

const loop = async () => {
    console.log('loop', loop.settings)

    const next = () => {
        console.log('go next loop')
        // setTimeout(loop, 1000)
    }

    // delete dangling images
    await dockerImagePrune()

    // delete images with retentions
    await dockerImageRetain(loop.settings.rules)

    next()
}

// Start interface
export const start = ({ vacuum }) => {
    loop.settings = vacuum
    loop()
}
