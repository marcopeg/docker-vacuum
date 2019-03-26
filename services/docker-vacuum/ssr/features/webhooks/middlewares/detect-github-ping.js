import { logError, logDebug } from 'services/logger'

export const makeDetectGithubPing = (settings) => {
    return (req, res, next) => {
        try {
            if (req.headers['x-github-event'] === 'ping') {
                res.send('pong')
                return
            }
        } catch (err) {
            logError(err.message)
            logDebug(err)
        }

        next()
    }
}
