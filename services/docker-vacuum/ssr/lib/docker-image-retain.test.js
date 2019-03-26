import '@babel/polyfill'
import {
    findDistinctImages,
    dockerImageRetain,
    matchRules,
} from './docker-image-retain'

import { rules1 } from './docker-image-retain.fixture'

// This is to recycle the fake data
import { parseResponse } from './docker-images'
import { r1, r3 } from './docker-imates.fixture'

describe('lib/docker-image-retain', () => {

    test('it should find single images as list', () => {
        const lines = parseResponse(r3)
        const res = findDistinctImages(lines)
        expect(res.length).toEqual(3)
    })

    test('it should match rules', () => {
        const lines = parseResponse(r1)
        const uniques = findDistinctImages(lines)
        const res = matchRules(rules1, uniques)

        expect(res.length).toBe(4)
        expect(res[0].retain).toBe(1)
        expect(res[2].repository).toBe('mariadb')
        expect(res[3].retain).toBe(2)
    })

    test('it should apply retentions rules on real docker stuff', async () => {
        await dockerImageRetain(rules1)
    })
})
