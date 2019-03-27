import * as jwt from 'services/jwt'
import { logError, logDebug } from 'services/logger'

export const makeValidateJwt = (settings) => {
    return async (req, res, next) => {
        try {
            req.data.token = await jwt.verify(req.params.token)
            next()
        } catch (err) {
            logError(err.message)
            logDebug(err)
            res.status(400).send('unacceptable jwt')
        }
    }
}