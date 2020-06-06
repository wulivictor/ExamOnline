"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("../utils/httpRequest"));
const utils_1 = require("../utils/utils");
const code_1 = require("../const/code");
async function callWxOpenApi(cloudbase, { apiName, requestData }, opts) {
    let transformRequestData;
    try {
        transformRequestData = requestData ? JSON.stringify(requestData) : '';
    }
    catch (e) {
        throw utils_1.E(Object.assign(Object.assign({}, e), { code: code_1.ERROR.INVALID_PARAM.code, message: '对象出现了循环引用' }));
    }
    const params = {
        action: 'wx.api',
        apiName,
        requestData: transformRequestData
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        params,
        method: 'post',
        opts,
        headers: {
            'content-type': 'application/json'
        },
        customApiUrl: utils_1.getWxUrl(cloudbase.config)
    }).then(res => {
        if (res.code) {
            return res;
        }
        //     throw E({ ...res })
        // } else {
        let result;
        try {
            result = JSON.parse(res.data.responseData);
        }
        catch (e) {
            result = res.data.responseData;
        }
        return {
            result,
            requestId: res.requestId
        };
        // }
    });
}
exports.callWxOpenApi = callWxOpenApi;
/**
 * 调用wxopenAPi
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
async function callCompatibleWxOpenApi(cloudbase, { apiName, requestData }, opts) {
    const params = {
        action: 'wx.openApi',
        apiName,
        requestData
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        params,
        isFormData: true,
        customApiUrl: utils_1.getWxUrl(cloudbase.config),
        opts
    }).then(res => res);
}
exports.callCompatibleWxOpenApi = callCompatibleWxOpenApi;
/**
 * wx.wxPayApi 微信支付用
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
async function callWxPayApi(cloudbase, { apiName, requestData }, opts) {
    const params = {
        action: 'wx.wxPayApi',
        apiName,
        requestData
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        params,
        isFormData: true,
        customApiUrl: utils_1.getWxUrl(cloudbase.config),
        opts
    });
}
exports.callWxPayApi = callWxPayApi;
