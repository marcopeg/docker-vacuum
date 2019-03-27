import '@babel/polyfill'
import {
    findDistinctImages,
    dockerImageRetain,
    matchRules,
    mergeRules,
    getUnretainedImages,
    getObsoleteImages,
} from './docker-image-retain'

import { rules1, matches1 } from './docker-image-retain.fixture'

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

    test('it should merge matches with full images data', () => {
        const lines = parseResponse(r1)
        const uniques = findDistinctImages(lines)
        const matches = matchRules(rules1, uniques)
        const res = mergeRules(matches, lines)
        
        expect(JSON.stringify(res)).toBe(JSON.stringify(matches1))
    })

    test('it should calculate the list of ids that need to be delete for a repositoty', () => {
        const res = getUnretainedImages(matches1[0].images, matches1[0].retain)
        expect(res.length).toBe(4)
    })

    test('it should calculate obsolete ids out of images and rules', () => {
        const ids = getObsoleteImages(parseResponse(r1), rules1)
        expect(ids.map($ => $.uuid)).toEqual([ 
            '46f147e02b2d',
            '60f7a4e47209',
            'd358bfcfa658',
            '43a6c8ee8825'
        ])
    })

    test('it should work even without images!', () => {
        const obsolete = getObsoleteImages(parseResponse(``), rules1)
        expect(obsolete).toEqual([])
    })

    test.skip('it should apply retentions rules on real docker stuff', async () => {
        await dockerImageRetain(rules1)
    })
})
