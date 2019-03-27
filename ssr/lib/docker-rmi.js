import { exec } from './exec'

export const dockerRmi = async (imageId) =>
    exec(`docker rmi -f ${imageId}`)
