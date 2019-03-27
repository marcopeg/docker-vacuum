import crypto from 'crypto'
import * as jwt from 'services/jwt'

export const makeEncryptRoute = (settings) => {
    return async (req, res) => {

        const cipher = crypto.createCipher(settings.crypto.algorithm, settings.jwt.secret)
        let crypted = cipher.update(req.data.token.auth.password, 'utf8', 'hex')
        crypted += cipher.final('hex')

        req.data.token.auth.password = crypted

        res.send(await jwt.sign(req.data.token))
    }
}
