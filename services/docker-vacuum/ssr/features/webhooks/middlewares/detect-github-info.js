import { logError, logDebug } from 'services/logger'

const getPrEventName = (body) => {
    const re = new RegExp('(?!^$)')

    // merged
    if (body.pull_request
        && body.pull_request.state === 'closed'
        && body.pull_request.merged_at
        && body.pull_request.merged_at.match(re)) {
        return 'pull_request_merged'
    }
    
    // rejected
    if (body.pull_request
        && body.pull_request.state === 'closed'
        && !body.pull_request.merged_at) {
        return 'pull_request_rejected'
    }

    return 'pull_request'
}

const getCreateEventName = (body) => {
    if (body.ref_type === 'tag') {
        return 'create_tag'
    }

    return 'create'
}

const getPushBranch = (body) => {
    if (body.ref.indexOf('refs/heads/') !== -1) {
        return body.ref.substr(11)
    }

    return body.ref
}

const getPrBranch = (body) => {
    return body.pull_request.head.ref
}

const getReleaseBranch = (body) => {
    return body.release.target_commitish
}

const resolveEvent = {
    pull_request: getPrEventName,
    create: getCreateEventName,
}

const resolveBranch = {
    push: getPushBranch,
    pull_request: getPrBranch,
    release: getReleaseBranch,
}

const getEventName = (event, body) => {
    try {
        const handler = resolveEvent[event]
        return handler ? handler(body) : event
    } catch (err) {
        console.log(err)
        return event
    }
}

const getBranchName = (event, body) => {
    try {
        const handler = resolveBranch[event]
        return handler ? handler(body) : null
    } catch (err) {
        return null
    }
}

export const makeDetectGithubInfo = (settings) => {
    return (req, res, next) => {
        // console.log(JSON.stringify({
        //     headers: req.headers,
        //     body: req.body,
        // }))

        req.data.github = {
            event: null,
            branch: null,
        }

        try {
            req.data.github.event = getEventName(req.headers['x-github-event'], req.body)
            req.data.github.branch = getBranchName(req.headers['x-github-event'], req.body)
            // console.log(req.data.github)
        } catch (err) {
            logError(err.message)
            logDebug(err)
        }

        // res.send(req.data)
        next()
    }
}
