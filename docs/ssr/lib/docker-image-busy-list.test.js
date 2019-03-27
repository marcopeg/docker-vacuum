import '@babel/polyfill'
import { dockerImageBusyList } from './docker-image-busy-list'

describe('utils/docker-image-busy-list', () => {
    test('it should work', async () => {
        const res = await dockerImageBusyList()
        expect(res.length).toBeGreaterThan(-1)
    })
})