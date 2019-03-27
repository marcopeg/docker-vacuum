import { registerAction, createHookApp, logBoot } from '@marcopeg/hooks'
import { SETTINGS, FINISH } from '@marcopeg/hooks'
import * as config from '@marcopeg/utils/lib/config'
import { logError, logVerbose } from 'services/logger'

const services = [
    require('./services/env'),
    require('./services/logger'),
]

const features = [
    require('./features/vacuum'),
]

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {

        // Parse JSON rules
        let rules = []
        const rulesSrc = config.get('VACUUM_RULES').replace(/\\"/g, "\"")

        try {
            rules = JSON.parse(rulesSrc)
        } catch (err) {
            throw new Error(`Failed to parse rules`)
        }

        settings.vacuum = {
            interval: Number(config.get('VACUUM_INTERVAL')),
            rules,
        }
    },
})

registerAction({
    hook: FINISH,
    name: '♦ boot',
    handler: () => logBoot(),
})

export default createHookApp({
    settings: {},
    services,
    features,
})
