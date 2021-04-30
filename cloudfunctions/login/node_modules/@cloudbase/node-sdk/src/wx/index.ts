import httpRequest from '../utils/httpRequest'
import { ICustomReqOpts } from '../type'
import { E, getWxUrl } from '../utils/utils'
import { ERROR } from '../const/code'
import { CloudBase } from '../cloudbase'

export async function callWxOpenApi(
    cloudbase: CloudBase,
    { apiName, requestData },
    opts?: ICustomReqOpts
) {
    let transformRequestData
    try {
        transformRequestData = requestData ? JSON.stringify(requestData) : ''
    } catch (e) {
        throw E({ ...e, code: ERROR.INVALID_PARAM.code, message: '对象出现了循环引用' })
    }

    const params = {
        action: 'wx.api',
        apiName,
        requestData: transformRequestData
    }

    return httpRequest({
        config: cloudbase.config,
        params,
        method: 'post',
        opts,
        headers: {
            'content-type': 'application/json'
        },
        customApiUrl: getWxUrl(cloudbase.config)
    }).then(res => {
        if (res.code) {
            return res
        }
        //     throw E({ ...res })
        // } else {
        let result
        try {
            result = JSON.parse(res.data.responseData)
        } catch (e) {
            result = res.data.responseData
        }
        return {
            result,
            requestId: res.requestId
        }
        // }
    })
}

/**
 * 调用wxopenAPi
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
export async function callCompatibleWxOpenApi(
    cloudbase: CloudBase,
    { apiName, requestData },
    opts?: ICustomReqOpts
) {
    const params = {
        action: 'wx.openApi',
        apiName,
        requestData
    }

    return httpRequest({
        config: cloudbase.config,
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        params,
        isFormData: true,
        customApiUrl: getWxUrl(cloudbase.config),
        opts
    }).then(res => res)
}

/**
 * wx.wxPayApi 微信支付用
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
export async function callWxPayApi(
    cloudbase: CloudBase,
    { apiName, requestData },
    opts?: ICustomReqOpts
) {
    const params = {
        action: 'wx.wxPayApi',
        apiName,
        requestData
    }

    return httpRequest({
        config: cloudbase.config,
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        params,
        isFormData: true,
        customApiUrl: getWxUrl(cloudbase.config),
        opts
    })
}
