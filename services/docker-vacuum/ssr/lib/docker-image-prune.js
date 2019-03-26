import { exec } from './exec'

export const dockerImagePrune = () =>
    exec('docker image prune -f')
