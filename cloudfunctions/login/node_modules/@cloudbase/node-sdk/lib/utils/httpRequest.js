"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tracing_1 = require("./tracing");
const utils = __importStar(require("./utils"));
const code_1 = require("../const/code");
const symbol_1 = require("../const/symbol");
const cloudbase_1 = require("../cloudbase");
const request_1 = __importDefault(require("./request"));
const requestHook_1 = require("./requestHook");
const getWxCloudApiToken_1 = require("./getWxCloudApiToken");
const signature_nodejs_1 = require("@cloudbase/signature-nodejs");
const url_1 = __importDefault(require("url"));
const { version } = require('../../package.json');
const { E, second, processReturn, getServerInjectUrl } = utils;
class Request {
    constructor(args) {
        this.defaultEndPoint = 'tcb-admin.tencentcloudapi.com';
        this.inScfHost = 'tcb-admin.tencentyun.com';
        // private openApiHost: string = 'tcb-open.tencentcloudapi.com'
        this.urlPath = '/admin';
        this.defaultTimeout = 15000;
        this.timestamp = new Date().valueOf();
        this.tracingInfo = tracing_1.generateTracingInfo();
        this.args = args;
        this.config = args.config;
    }
    /**
     *
     * 接口action
     */
    getAction() {
        const { params } = this.args;
        const { action } = params;
        return action;
    }
    /**
     * 设置超时warning
     */
    setSlowRequeryWarning(action) {
        const { seqId } = this.tracingInfo;
        const warnStr = `Your current request ${action ||
            ''} is longer than 3s, it may be due to the network or your query performance | [${seqId}]`;
        // 暂针对数据库请求
        const warnTimer = setTimeout(() => {
            console.warn(warnStr);
        }, 3000);
        return warnTimer;
    }
    /**
     * 构造params
     */
    getParams() {
        const args = this.args;
        const config = this.config;
        const { eventId } = this.tracingInfo;
        let params = Object.assign(Object.assign({}, args.params), { envName: config.envName, eventId, 
            // wxCloudApiToken: process.env.WX_API_TOKEN || '',
            wxCloudApiToken: getWxCloudApiToken_1.getWxCloudApiToken(), 
            // 对应服务端 wxCloudSessionToken
            tcb_sessionToken: process.env.TCB_SESSIONTOKEN || '', sessionToken: config.sessionToken, sdk_version: version // todo 可去掉该参数
         });
        // 取当前云函数环境时，替换为云函数下环境变量
        if (params.envName === symbol_1.SYMBOL_CURRENT_ENV) {
            params.envName = process.env.TCB_ENV || process.env.SCF_NAMESPACE;
        }
        // 过滤value undefined
        utils.filterUndefined(params);
        return params;
    }
    /**
     *  构造请求项
     */
    makeReqOpts() {
        // 校验密钥是否存在
        this.validateSecretIdAndKey();
        const config = this.config;
        const args = this.args;
        const url = this.getUrl();
        const method = this.getMethod();
        const params = this.getParams();
        const opts = {
            url,
            method,
            // 先取模块的timeout，没有则取sdk的timeout，还没有就使用默认值
            // timeout: args.timeout || config.timeout || 15000,
            timeout: this.getTimeout(),
            // 优先取config，其次取模块，最后取默认
            headers: this.getHeaders(),
            proxy: config.proxy
        };
        if (config.forever === true) {
            opts.forever = true;
        }
        if (args.method === 'post') {
            if (args.isFormData) {
                opts.formData = params;
                opts.encoding = null;
            }
            else {
                opts.body = params;
                opts.json = true;
            }
        }
        else {
            opts.qs = params;
        }
        return opts;
    }
    /**
     * 协议
     */
    getProtocol() {
        return this.config.isHttp === true ? 'http' : 'https';
    }
    /**
     * 请求方法
     */
    getMethod() {
        return this.args.method || 'get';
    }
    /**
     * 超时时间
     */
    getTimeout() {
        const { opts = {} } = this.args;
        // timeout优先级 自定义接口timeout > config配置timeout > 默认timeout
        return opts.timeout || this.config.timeout || this.defaultTimeout;
    }
    /**
     * 获取
     */
    /**
     * 校验密钥和token是否存在
     */
    validateSecretIdAndKey() {
        const isInSCF = utils.checkIsInScf();
        const { secretId, secretKey } = this.config;
        if (!secretId || !secretKey) {
            // 用户init未传入密钥对，读process.env
            const envSecretId = process.env.TENCENTCLOUD_SECRETID;
            const envSecretKey = process.env.TENCENTCLOUD_SECRETKEY;
            const sessionToken = process.env.TENCENTCLOUD_SESSIONTOKEN;
            if (!envSecretId || !envSecretKey) {
                if (isInSCF) {
                    throw E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'missing authoration key, redeploy the function' }));
                }
                else {
                    throw E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'missing secretId or secretKey of tencent cloud' }));
                }
            }
            else {
                this.config = Object.assign(Object.assign({}, this.config), { secretId: envSecretId, secretKey: envSecretKey, sessionToken: sessionToken });
                return;
            }
        }
    }
    /**
     *
     * 获取headers 此函数中设置authorization
     */
    getHeaders() {
        const config = this.config;
        const { secretId, secretKey } = config;
        const args = this.args;
        const method = this.getMethod();
        const isInSCF = utils.checkIsInScf();
        // Note: 云函数被调用时可能调用端未传递 SOURCE，TCB_SOURCE 可能为空
        const TCB_SOURCE = process.env.TCB_SOURCE || '';
        const SOURCE = isInSCF ? `${TCB_SOURCE},scf` : ',not_scf';
        const url = this.getUrl();
        // 默认
        let requiredHeaders = {
            'User-Agent': `tcb-node-sdk/${version}`,
            'x-tcb-source': SOURCE,
            'x-client-timestamp': this.timestamp,
            'X-SDK-Version': `tcb-node-sdk/${version}`,
            Host: url_1.default.parse(url).host
        };
        if (config.version) {
            requiredHeaders['X-SDK-Version'] = config.version;
        }
        requiredHeaders = Object.assign(Object.assign(Object.assign({}, config.headers), args.headers), requiredHeaders);
        const params = this.getParams();
        const { authorization, timestamp } = signature_nodejs_1.sign({
            secretId: secretId,
            secretKey: secretKey,
            method: method,
            url: url,
            params: params,
            headers: requiredHeaders,
            withSignedParams: true,
            timestamp: second() - 1
        });
        requiredHeaders['Authorization'] = authorization;
        requiredHeaders['X-Signature-Expires'] = 600;
        requiredHeaders['X-Timestamp'] = timestamp;
        return Object.assign({}, requiredHeaders);
    }
    /**
     * 获取url
     * @param action
     */
    getUrl() {
        const protocol = this.getProtocol();
        const isInSCF = utils.checkIsInScf();
        const { eventId, seqId } = this.tracingInfo;
        const { customApiUrl } = this.args;
        const { serviceUrl } = this.config;
        const serverInjectUrl = getServerInjectUrl();
        const defaultUrl = isInSCF
            ? `http://${this.inScfHost}${this.urlPath}`
            : `${protocol}://${this.defaultEndPoint}${this.urlPath}`;
        let url = serviceUrl || serverInjectUrl || customApiUrl || defaultUrl;
        let urlQueryStr = `&eventId=${eventId}&seqId=${seqId}`;
        const scfContext = cloudbase_1.CloudBase.scfContext;
        if (scfContext) {
            urlQueryStr = `&eventId=${eventId}&seqId=${seqId}&scfRequestId=${scfContext.request_id}`;
        }
        if (url.includes('?')) {
            url = `${url}${urlQueryStr}`;
        }
        else {
            url = `${url}?${urlQueryStr}`;
        }
        return url;
    }
}
exports.Request = Request;
// 业务逻辑都放在这里处理
exports.default = async (args) => {
    const req = new Request(args);
    const reqOpts = req.makeReqOpts();
    const config = args.config;
    const action = req.getAction();
    let reqHooks;
    let warnTimer = null;
    if (action === 'wx.openApi' || action === 'wx.wxPayApi') {
        reqHooks = {
            handleData: requestHook_1.handleWxOpenApiData
        };
    }
    if (action.indexOf('database') >= 0) {
        warnTimer = req.setSlowRequeryWarning(action);
    }
    try {
        const res = await request_1.default(reqOpts, reqHooks);
        // 检查res是否为return {code, message}回包
        if (res.code) {
            // 判断是否设置config._returnCodeByThrow = false
            return processReturn(config.throwOnCode, res);
        }
        return res;
    }
    finally {
        if (warnTimer) {
            clearTimeout(warnTimer);
        }
    }
};
