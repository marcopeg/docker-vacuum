import path from 'path'
import * as config from '@marcopeg/utils/lib/config'
import { logInfo, logVerbose } from 'services/logger'
import {
    createHook,
    registerAction,
    createHookApp,
    logBoot,
    SETTINGS,
    FINISH,
} from '@marcopeg/hooks'

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
        settings.vacuum = {
            rules: [
                {
                    match: 'registry.24hr(.*)',
                    retain: 1,
                },
                {
                    match: 'mariadb',
                    retain: 1,
                },
                {
                    match: 'marcopeg/gatsby-deploy',
                    retain: 2,
                }
            ]
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
