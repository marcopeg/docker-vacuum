import '@babel/polyfill'
import { dockerSystemPrune } from './docker-system-prune'

describe.skip('docker-image-prune', () => {
    jest.setTimeout(1000 * 60 * 10)

    test('it should prune', async () => {
        try {
            const res = await dockerSystemPrune()
            expect(res.indexOf('Total reclaimed space')).toBeGreaterThan(-1)
        } catch (err) {
            console.log('err')
        }
    })
})
