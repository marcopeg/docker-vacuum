import md5 from 'md5'
import { logInfo, logError, logVerbose, logDebug } from 'services/logger'
import { build } from './lib/build'

const queueList = []
const queueMap = {}

const anonymizeBuildData = (data) => {
    try {
        const copy = JSON.parse(JSON.stringify(data))
        copy.token.auth.password = 'xxx'
        return copy
    } catch (err) {
        return { error: err.message }
    }
}

const removeBuild = (buildId) => {
    queueList.splice(queueList.indexOf(buildId), 1)
    delete queueMap[buildId]
}

const runBuild = (buildId, log, end) =>
    new Promise(async (resolve) => {
        const buildData = queueMap[buildId]
        const buildConfig = {
            ...buildData.token,
            config: buildData.config,
        }

        // Lock the build
        buildData.isRunning = true

        try {
            const report = await build(buildConfig, log)
            logInfo(`Build ${buildId} succeded in ${report.elapsedStr}`)
            const result = {
                success: true,
                build: {
                    id: buildId,
                    data: buildData,
                    config: buildConfig,
                },
                report,
            }
            end(result)
            resolve(result)
        } catch (error) {
            logError(`[build-daemon] Build failed: ${buildId} failed - ${error.message}`)
            logDebug(anonymizeBuildData(buildData))
            const result = {
                success: false,
                build: {
                    id: buildId,
                    data: buildData,
                    config: buildConfig,
                },
                error,
            }
            end(result)
            resolve(result)
        } finally {
            removeBuild(buildId)
        }
    })

const loop = () => {
    const next = () => setTimeout(loop, 1000)

    const onData = line => logVerbose(`[build-daemon] ${line}`)

    const onBuildEnd = (res) => {
        logVerbose(`[build-daemon] loop - ${res.build.id} ${res.success ? 'completed' : `failed - ${res.error.message}` }`)
        next()
    }

    // skip if building
    const runningBuild = queueList.find(buildId => queueMap[buildId].isRunning)
    if (runningBuild) {
        logVerbose(`[build-daemon] loop - skip due to ${runningBuild}`)
        next()
        return
    }

    // try to run a build
    const candidateBuild = queueList.find(buildId => !queueMap[buildId].isRunning)
    if (candidateBuild) {
        logVerbose(`[build-daemon] loop - trigger build ${candidateBuild}`)
        runBuild(candidateBuild, onData, onBuildEnd)
        return
    }

    logDebug('[build-daemon] loop - free as a bird')
    next()
}

// Maybe in the future we offer start/stop functionality
// anyway it is a good interface
export const start = loop

export const addBuild = (settings, log, end) => {
    const buildId = `build-${md5(JSON.stringify(settings.token))}`
    log(`id: ${buildId}`)

    // Check if already queued
    if (queueList.includes(buildId)) {
        log(`queued at position ${queueList.indexOf(buildId)}`)
        end()
        return
    }

    // Queue the build
    queueList.push(buildId)
    queueMap[buildId] = settings

    // Show info about the queue being queued in case the queue
    // is long, or in case the request came from a GitHub webook
    if (queueList.length > 1 || settings.githup) {
        log(`queued at position ${queueList.indexOf(buildId)}`)
        end()
        return
    }

    // Run the build right away and attach the logs to the output stream
    // runBuild(buildId, log, end)
    // console.log(settings)
    end()
}
