
import { logInfo } from 'services/logger'
import { addBuild } from '../build-daemon'

export const makeWebhookRoute = (config) => {
    return async (req, res) => {

        const data = {
            ...req.data,
            config: config.deploy,
        }

        const onData = (line) => {
            res.write(`${line}\n`)
            logInfo(line)
        }

        const onEnd = () => {
            res.end()
        }

        addBuild(data, onData, onEnd)
    }
}
