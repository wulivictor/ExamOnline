import { generateTracingInfo } from './tracing'
import * as utils from './utils'
import { ICloudBaseConfig, IRequestInfo, ICustomParam, IReqOpts, IReqHooks } from '../type/index'
import { ERROR } from '../const/code'
import { SYMBOL_CURRENT_ENV } from '../const/symbol'
import { CloudBase } from '../cloudbase'

import baseRequest from './request'
import { handleWxOpenApiData } from './requestHook'
import { getWxCloudApiToken } from './getWxCloudApiToken'
import { sign } from '@cloudbase/signature-nodejs'
import URL from 'url'
const { version } = require('../../package.json')
const { E, second, processReturn, getServerInjectUrl } = utils

export class Request {
    private args: IRequestInfo
    private config: ICloudBaseConfig
    private defaultEndPoint = 'tcb-admin.tencentcloudapi.com'
    private inScfHost = 'tcb-admin.tencentyun.com'
    // private openApiHost: string = 'tcb-open.tencentcloudapi.com'
    private urlPath = '/admin'
    private defaultTimeout = 15000
    private timestamp: number = new Date().valueOf()
    private tracingInfo: {
        eventId: string
        seqId: string
    } = generateTracingInfo()

    public constructor(args: IRequestInfo) {
        this.args = args
        this.config = args.config
    }

    /**
     *
     * 接口action
     */
    public getAction(): string {
        const { params } = this.args
        const { action } = params
        return action
    }

    /**
     * 设置超时warning
     */
    public setSlowRequeryWarning(action: string): NodeJS.Timer {
        const { seqId } = this.tracingInfo

        const warnStr = `Your current request ${action ||
            ''} is longer than 3s, it may be due to the network or your query performance | [${seqId}]`
        // 暂针对数据库请求
        const warnTimer = setTimeout(() => {
            console.warn(warnStr)
        }, 3000)
        return warnTimer
    }

    /**
     * 构造params
     */
    public getParams(): any {
        const args = this.args

        const config = this.config

        const { eventId } = this.tracingInfo

        let params: ICustomParam = {
            ...args.params,
            envName: config.envName,
            eventId,
            // wxCloudApiToken: process.env.WX_API_TOKEN || '',
            wxCloudApiToken: getWxCloudApiToken(),
            // 对应服务端 wxCloudSessionToken
            tcb_sessionToken: process.env.TCB_SESSIONTOKEN || '',
            sessionToken: config.sessionToken,
            sdk_version: version // todo 可去掉该参数
        }

        // 取当前云函数环境时，替换为云函数下环境变量
        if (params.envName === SYMBOL_CURRENT_ENV) {
            params.envName = process.env.TCB_ENV || process.env.SCF_NAMESPACE
        }

        // 过滤value undefined
        utils.filterUndefined(params)

        return params
    }

    /**
     *  构造请求项
     */
    public makeReqOpts(): IReqOpts {
        // 校验密钥是否存在
        this.validateSecretIdAndKey()

        const config = this.config
        const args = this.args
        const url = this.getUrl()
        const method = this.getMethod()
        const params = this.getParams()

        const opts: IReqOpts = {
            url,
            method,
            // 先取模块的timeout，没有则取sdk的timeout，还没有就使用默认值
            // timeout: args.timeout || config.timeout || 15000,
            timeout: this.getTimeout(), // todo 细化到api维度 timeout
            // 优先取config，其次取模块，最后取默认
            headers: this.getHeaders(),
            proxy: config.proxy
        }

        if (config.forever === true) {
            opts.forever = true
        }

        if (args.method === 'post') {
            if (args.isFormData) {
                opts.formData = params
                opts.encoding = null
            } else {
                opts.body = params
                opts.json = true
            }
        } else {
            opts.qs = params
        }

        return opts
    }

    /**
     * 协议
     */
    private getProtocol(): string {
        return this.config.isHttp === true ? 'http' : 'https'
    }

    /**
     * 请求方法
     */
    private getMethod(): string {
        return this.args.method || 'get'
    }

    /**
     * 超时时间
     */
    private getTimeout(): number {
        const { opts = {} } = this.args
        // timeout优先级 自定义接口timeout > config配置timeout > 默认timeout
        return opts.timeout || this.config.timeout || this.defaultTimeout
    }

    /**
     * 获取
     */

    /**
     * 校验密钥和token是否存在
     */
    private validateSecretIdAndKey(): void {
        const isInSCF = utils.checkIsInScf()
        const { secretId, secretKey } = this.config
        if (!secretId || !secretKey) {
            // 用户init未传入密钥对，读process.env
            const envSecretId = process.env.TENCENTCLOUD_SECRETID
            const envSecretKey = process.env.TENCENTCLOUD_SECRETKEY
            const sessionToken = process.env.TENCENTCLOUD_SESSIONTOKEN
            if (!envSecretId || !envSecretKey) {
                if (isInSCF) {
                    throw E({
                        ...ERROR.INVALID_PARAM,
                        message: 'missing authoration key, redeploy the function'
                    })
                } else {
                    throw E({
                        ...ERROR.INVALID_PARAM,
                        message: 'missing secretId or secretKey of tencent cloud'
                    })
                }
            } else {
                this.config = {
                    ...this.config,
                    secretId: envSecretId,
                    secretKey: envSecretKey,
                    sessionToken: sessionToken
                }
                return
            }
        }
    }

    /**
     *
     * 获取headers 此函数中设置authorization
     */
    private getHeaders(): any {
        const config = this.config
        const { secretId, secretKey } = config
        const args = this.args
        const method = this.getMethod()
        const isInSCF = utils.checkIsInScf()
        // Note: 云函数被调用时可能调用端未传递 SOURCE，TCB_SOURCE 可能为空
        const TCB_SOURCE = process.env.TCB_SOURCE || ''
        const SOURCE = isInSCF ? `${TCB_SOURCE},scf` : ',not_scf'
        const url = this.getUrl()
        // 默认
        let requiredHeaders = {
            'User-Agent': `tcb-node-sdk/${version}`,
            'x-tcb-source': SOURCE,
            'x-client-timestamp': this.timestamp,
            'X-SDK-Version': `tcb-node-sdk/${version}`,
            Host: URL.parse(url).host
        }

        if (config.version) {
            requiredHeaders['X-SDK-Version'] = config.version
        }

        requiredHeaders = { ...config.headers, ...args.headers, ...requiredHeaders }
        const params = this.getParams()

        const { authorization, timestamp } = sign({
            secretId: secretId,
            secretKey: secretKey,
            method: method,
            url: url,
            params: params,
            headers: requiredHeaders,
            withSignedParams: true,
            timestamp: second() - 1
        })

        requiredHeaders['Authorization'] = authorization
        requiredHeaders['X-Signature-Expires'] = 600
        requiredHeaders['X-Timestamp'] = timestamp

        return { ...requiredHeaders }
    }

    /**
     * 获取url
     * @param action
     */
    private getUrl(): string {
        const protocol = this.getProtocol()
        const isInSCF = utils.checkIsInScf()
        const { eventId, seqId } = this.tracingInfo
        const { customApiUrl } = this.args
        const { serviceUrl } = this.config
        const serverInjectUrl = getServerInjectUrl()

        const defaultUrl = isInSCF
            ? `http://${this.inScfHost}${this.urlPath}`
            : `${protocol}://${this.defaultEndPoint}${this.urlPath}`

        let url = serviceUrl || serverInjectUrl || customApiUrl || defaultUrl

        let urlQueryStr = `&eventId=${eventId}&seqId=${seqId}`
        const scfContext = CloudBase.scfContext
        if (scfContext) {
            urlQueryStr = `&eventId=${eventId}&seqId=${seqId}&scfRequestId=${scfContext.request_id}`
        }

        if (url.includes('?')) {
            url = `${url}${urlQueryStr}`
        } else {
            url = `${url}?${urlQueryStr}`
        }

        return url
    }
}

// 业务逻辑都放在这里处理
export default async (args: IRequestInfo): Promise<any> => {
    const req = new Request(args)
    const reqOpts = req.makeReqOpts()
    const config = args.config
    const action = req.getAction()

    let reqHooks: IReqHooks
    let warnTimer = null

    if (action === 'wx.openApi' || action === 'wx.wxPayApi') {
        reqHooks = {
            handleData: handleWxOpenApiData
        }
    }

    if (action.indexOf('database') >= 0) {
        warnTimer = req.setSlowRequeryWarning(action)
    }

    try {
        const res = await baseRequest(reqOpts, reqHooks)
        // 检查res是否为return {code, message}回包
        if (res.code) {
            // 判断是否设置config._returnCodeByThrow = false
            return processReturn(config.throwOnCode, res)
        }

        return res
    } finally {
        if (warnTimer) {
            clearTimeout(warnTimer)
        }
    }
}
