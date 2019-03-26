import { EXPRESS_ROUTE } from 'services/express/hooks'
import { FEATURE_NAME } from './hooks'
import pkg from '../../../package.json'

export const register = ({ registerAction, settings }) =>
    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ app }) =>
            app.get('/', (req, res) =>
                res.send({
                    name: pkg.name,
                    version: pkg.version,
                    description: pkg.description,
                })),
    })
