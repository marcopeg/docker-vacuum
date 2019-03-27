import '@babel/polyfill'
import path from 'path'
import { spawn } from './spawn'

describe('lib/spawn', () => {
    test('spawn should run "ls" and exit with code "0"', async () => {
        const res = await spawn('ls')
        expect(res).toEqual(0)
    })

    test('spawn should log stuff', async (done) => {
        await spawn('ls', {
            log: (data) => {
                expect(data.indexOf('package.json')).toBeGreaterThan(-1)
                done()
            }
        })
    })

    test('spawn should work in a specific cwd', async (done) => {
        await spawn('ls', {
            cwd: path.join(process.cwd(), 'ssr'),
            log: (data) => {
                expect(data.indexOf('boot.js')).toBeGreaterThan(-1)
                done()
            }
        })
    })

    test('spawn should fail if the command does not exists', async () => {
        try {
            await spawn('imadethisup')
        } catch (err) {
            expect(err.message.indexOf('imadethisup')).toBeGreaterThan(-1)
        }
    })
})
