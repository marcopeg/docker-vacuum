import bodyParser from 'body-parser'
import { START_FEATURE } from '@marcopeg/hooks'
import { EXPRESS_MIDDLEWARE, EXPRESS_ROUTE } from 'services/express/hooks'
import { FEATURE_NAME } from './hooks'
import { makeDetectGithubPing } from './middlewares/detect-github-ping'
import { makeDetectGithubInfo } from './middlewares/detect-github-info'
import { makeValidateJwt } from './middlewares/validate-jwt'
import { makeValidateJwtRules } from './middlewares/validate-jwt-rules'
import { makeDecryptJwt } from './middlewares/decrypt-jwt'
import { makeWebhookRoute } from './routes/webhook-route'
import { makeEncryptRoute } from './routes/encrypt-route'
import { start as startBuildDaemon } from './build-daemon'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ app }) =>
            app.use(bodyParser.json()),
    })
    registerAction({
        hook: START_FEATURE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: () => startBuildDaemon(),
    })
    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ app }) => {
            app.post('/hook/:token', [
                makeDetectGithubPing(settings),
                makeDetectGithubInfo(settings),
                makeValidateJwt(settings),
                makeValidateJwtRules(settings),
                makeDecryptJwt(settings),
                makeWebhookRoute(settings),
            ])
            app.get('/hook/:token', [
                makeValidateJwt(settings),
                makeDecryptJwt(settings),
                makeWebhookRoute(settings),
            ])
            app.get('/encrypt/:token', [
                makeValidateJwt(settings),
                makeEncryptRoute(settings),
            ])
        },
    })

}