import tcb from '../../src/index'
import assert from 'assert'
import config from '../config.local'
import { ERROR } from '../../src/const/code'
import { checkIsGray } from '../../src/utils/utils'

describe('functions.invokeFunction: 执行云函数', () => {
    const app = tcb.init(config)

    it('校验调用云函数传参', async () => {
        let a: any = {}
        let b: any = {}
        a.c = b
        b.c = a
        let result
        try {
            result = await app.callFunction({
                name: 'test',
                data: a
            })
        } catch (e) {
            if (checkIsGray() || config._useFeature) {
                assert(e.code === ERROR.INVALID_PARAM.code && e.message === '对象出现了循环引用')
            }
        }

        try {
            result = await app.callFunction({
                name: '',
                data: { a: 1 }
            })
        } catch (e) {
            if (checkIsGray() || config._useFeature) {
                assert(e.code === ERROR.INVALID_PARAM.code && e.message === '函数名不能为空')
            }
        }
    })

    it('执行云函数', async () => {
        try {
            const result = await app.callFunction({
                name: 'test-env',
                data: { a: 1 }
            })

            console.log(result)
        } catch (e) {
            assert(e.code === 'FUNCTIONS_EXECUTE_FAIL')
        }
    }, 30000)

    it('执行不存在的云函数', async () => {
        try {
            const result = await app.callFunction({
                name: 'unexistFunction',
                data: { a: 1 }
            })
        } catch (e) {
            assert(e.code === 'FUNCTIONS_EXECUTE_FAIL')
        }
    })

    // 灰度期间暂不放开新特性
    it.skip('执行云函数 设定自定义超时', async () => {
        try {
            const result = await app.callFunction(
                {
                    name: 'test',
                    data: { a: 1 }
                }
                // {
                //     timeout: 10
                // }
            )
            assert(!result)
        } catch (err) {
            // console.log(err)
            assert(err.code === 'ESOCKETTIMEDOUT')
        }
    }, 30000)

    it('mock callFunction 回包为string', async () => {
        jest.resetModules()
        jest.mock('request', () => {
            return jest.fn().mockImplementation((params, callback) => {
                callback(null, { statusCode: 200 }, { data: { response_data: 'test' } })
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
            console.log(err)
        }
    })

    it('function debug', async () => {
        const app = tcb.init(config)
        const callRes = await app.callFunction({
            name: 'invoke',
            data: {
                key1: 'test value 1',
                key2: 'test value 2',
                userInfo: {
                    // appId: '',
                    openId: 'oaoLb4qz0R8STBj6ipGlHkfNCO2Q'
                }
            }
        })
        console.log('callRes:', callRes)
    })
})
