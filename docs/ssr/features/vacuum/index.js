import { START_FEATURE } from '@marcopeg/hooks'
import { FEATURE_NAME } from './hooks'
import { start as startDaemon } from './daemon'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: startDaemon,
    })
}
