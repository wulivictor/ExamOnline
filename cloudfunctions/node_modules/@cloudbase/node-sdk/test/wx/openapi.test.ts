import tcb from '../../src/index'
import assert from 'assert'
import config from '../config.local'
import { ERROR } from '../../src/const/code'
import { checkIsGray } from '../../src/utils/utils'

// TODO 删除前先创建
describe('wx.openApi: 微信openapi', () => {
    const app = tcb.init(config)

    it('传参JSON.stringify报错', async () => {
        let a: any = {}
        let b: any = {}
        a.c = b
        b.c = a
        let result
        try {
            result = await app.callWxOpenApi({
                apiName: '/inner/svrkitclientcall',
                requestData: a
            })
        } catch (e) {
            if (checkIsGray() || config._useFeature) {
                assert(e.code === ERROR.INVALID_PARAM.code)
            }
        }
    })

    it('微信openapi', async () => {
        try {
            let result = await app.callWxOpenApi({
                apiName: '/inner/svrkitclientcall',
                requestData: { name: 'jamespeng' }
            })
            console.log(result)
        } catch (e) {
            assert(e.code === ERROR.INVALID_PARAM.code)
        }
        // assert(result.result, '微信openapi失败');
    }, 30000)

    it('微信new openapi', async () => {
        try {
            let result = await app.callCompatibleWxOpenApi({
                apiName: '/AAA/BBB/sample',
                requestData: Buffer.from(JSON.stringify({ name: 'jamespeng' }))
            })
        } catch (e) {
            assert(e.code === ERROR.INVALID_PARAM.code)
        }
        // console.log(result)
        // assert(result.result, '微信openapi失败');
    }, 30000)

    // mock callWxOpenApi 回包为string
    it('微信openapi mock回包为string', async () => {
        jest.resetModules()
        jest.mock('request', () => {
            return jest.fn().mockImplementation((params, callback) => {
                callback(null, { statusCode: 200 }, { data: { responseData: 'test' } })
            })
        })

        const tcb1 = require('../../src/index')
        const app1 = tcb1.init(config)
        try {
            let result = await app1.callWxOpenApi({
                apiName: '/inner/svrkitclientcall',
                requestData: { name: 'jamespeng' }
            })
            // console.log(result)
            assert(typeof result.result === 'string')
        } catch (err) {
            // assert(err.code === 'STORAGE_REQUEST_FAIL')
            console.log(err)
        }
    })

    it('微信 wxPayApi', async () => {
        try {
            let result = await app.callWxPayApi({
                apiName: 'cloudPay.getRefundStatus',
                requestData: Buffer.from(JSON.stringify({ api: 'getRefundStatus', data: {} }))
            })
        } catch (e) {
            assert(e.code === ERROR.INVALID_PARAM.code)
        }
        // console.log(result)
        // assert(result.result, '微信openapi失败');
    }, 30000)
})
