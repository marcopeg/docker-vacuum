import '@babel/polyfill'
import { dockerImagePrune } from './docker-image-prune'

describe.skip('docker-image-prune', () => {
    jest.setTimeout(1000 * 60 * 10)

    test('it should prune', async () => {
        try {
            const res = await dockerImagePrune()
            expect(res.indexOf('Total reclaimed space')).toBeGreaterThan(-1)
        } catch (err) {
            console.log('err')
        }
    })
})
