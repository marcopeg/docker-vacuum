import { exec } from './exec'

export const dockerSystemPrune = () =>
    exec('docker system prune --volumes --force')
