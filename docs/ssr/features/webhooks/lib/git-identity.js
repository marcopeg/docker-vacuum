import { exec } from './exec'

export const gitIdentity = async ({ email, username }) => {
    await exec(`git config --global user.name ${username}`)
    await exec(`git config --global user.email ${email}`)
}
