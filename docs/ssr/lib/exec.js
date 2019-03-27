import { exec as execCmd } from 'child_process'

export const exec = (cmd, options = {}) =>
    new Promise((resolve, reject) => {
        execCmd(cmd, options, (err, stdout, stderr) => {
            if (err) {
                reject(new Error(err))
                return
            }
            resolve(stdout.toString())
        })
    })
