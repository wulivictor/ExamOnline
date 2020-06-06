import { ICustomReqOpts } from '../type';
import { CloudBase } from '../cloudbase';
export declare function callWxOpenApi(cloudbase: CloudBase, { apiName, requestData }: {
    apiName: any;
    requestData: any;
}, opts?: ICustomReqOpts): Promise<any>;
/**
 * 调用wxopenAPi
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
export declare function callCompatibleWxOpenApi(cloudbase: CloudBase, { apiName, requestData }: {
    apiName: any;
    requestData: any;
}, opts?: ICustomReqOpts): Promise<any>;
/**
 * wx.wxPayApi 微信支付用
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
export declare function callWxPayApi(cloudbase: CloudBase, { apiName, requestData }: {
    apiName: any;
    requestData: any;
}, opts?: ICustomReqOpts): Promise<any>;
