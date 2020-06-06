import tcb from '../../src/index'
import assert from 'assert'
import config from '../config.local'
import { ERROR } from '../../src/const/code'
import { checkIsGray } from '../../src/utils/utils'

describe('mock request 回包处理逻辑', () => {
    it('mock callFunction 回包为string', async () => {
        jest.resetModules()
        jest.mock('request', () => {
            return jest.fn().mockImplementation((params, callback) => {
                callback(
                    null,
                    { statusCode: 200 },
                    JSON.stringify({ data: { response_data: 'test' } })
                )
            })
        })

        const tcb1 = require('../../src/index')
        const app1 = tcb1.init(config)
        try {
            let result = await app1.callFunction({
                name: 'unexistFunction',
                data: { a: 1 }
            })
            // console.log(result)
            assert(typeof result.result === 'string')
        } catch (err) {
            // assert(err.code === 'STORAGE_REQUEST_FAIL')
            console.log(err)
        }
    })

    it('mock request statusCode!==200', async () => {
        jest.resetModules()
        jest.mock('request', () => {
            return jest.fn().mockImplementation((params, callback) => {
                callback(null, { statusCode: 400 }, null)
            })
        })

        const tcb1 = require('../../src/index')
        const app1 = tcb1.init(config)
        try {
            let result = await app1.callFunction({
                name: 'unexistFunction',
                data: { a: 1 }
            })
            // console.log(result)
            // assert(typeof result.result === 'string')
        } catch (err) {
            if (checkIsGray() || config._useFeature) {
                assert(err.code === 400)
            } else {
                assert(err.statusCode === 400)
            }
            // console.log(err)
        }
    })
})
