import { logVerbose } from 'services/logger'

const validateGithubHookTrigger = (trigger, req) => {
    const { github } = req.data

    if (trigger.event
        && trigger.event !== github.event
    ) {
        logVerbose(`expected event "${trigger.event}" but got "${github.event}"`)
        throw new Error('wrong github event')
    }

    if (trigger.branch
        && github.branch !== trigger.branch) {
        logVerbose(`expected branch "${trigger.branch}" but got "${github.branch}"`)
        throw new Error('wrong branch')
    }
}

const triggers = {
    'github-hook': validateGithubHookTrigger,
}

export const makeValidateJwtRules = (settings) => {
    return async (req, res, next) => {
        const { token } = req.data

        if (!token.trigger) {
            res.status(412)
            res.send('jwt is missing trigger rules')
            return
        }

        try {
            triggers[token.trigger.type](token.trigger, req)
            // res.send('ok')
            next()
        } catch (err) {
            // console.log(err)
            res.status(412)
            res.send(err.message)
        }
    }
}