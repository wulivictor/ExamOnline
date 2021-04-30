import { Db } from '@cloudbase/database'
import { callFunction } from './functions'
import { auth } from './auth'
import { callWxOpenApi, callCompatibleWxOpenApi, callWxPayApi } from './wx'
import { uploadFile, deleteFile, getTempFileURL, downloadFile, getUploadMetadata } from './storage'
import {
    ICloudBaseConfig,
    ICustomReqOpts,
    ICustomErrRes,
    IDeleteFileRes,
    IGetFileUrlRes,
    IDownloadFileRes,
    IUploadFileRes,
    IContext
} from './type'
import { DBRequest } from './utils/dbRequest'
import { Log, logger } from './log'
import { ERROR } from './const/code'
import { E, checkIsGray } from './utils/utils'
import tcb from 'tcb-admin-node'

const GRAY_ENV_KEY = 'TCB_SDK_GRAY_0'

export class CloudBase {
    public static scfContext: IContext
    public static parseContext(context: IContext): IContext {
        if (typeof context !== 'object') {
            throw E({ ...ERROR.INVALID_CONTEXT, message: 'context 必须为对象类型' })
        }
        let {
            memory_limit_in_mb,
            time_limit_in_ms,
            request_id,
            environ,
            function_version,
            namespace,
            function_name,
            environment
        } = context
        let parseResult: any = {}

        try {
            parseResult.memoryLimitInMb = memory_limit_in_mb
            parseResult.timeLimitIns = time_limit_in_ms
            parseResult.requestId = request_id
            parseResult.functionVersion = function_version
            parseResult.namespace = namespace
            parseResult.functionName = function_name

            // 存在environment 为新架构 上新字段 JSON序列化字符串
            if (environment) {
                parseResult.environment = JSON.parse(environment)
                return parseResult
            }

            // 不存在environment 则为老字段，老架构上存在bug，无法识别value含特殊字符(若允许特殊字符，影响解析，这里特殊处理)

            const parseEnviron = environ.split(';')
            let parseEnvironObj = {}
            for (let i in parseEnviron) {
                // value含分号影响切割，未找到= 均忽略
                if (parseEnviron[i].indexOf('=') >= 0) {
                    const equalIndex = parseEnviron[i].indexOf('=')
                    const key = parseEnviron[i].slice(0, equalIndex)
                    let value: any = parseEnviron[i].slice(equalIndex + 1)

                    // value 含, 为数组
                    if (value.indexOf(',') >= 0) {
                        value = value.split(',')
                    }
                    parseEnvironObj[key] = value
                }
            }

            parseResult.environ = parseEnvironObj
        } catch (err) {
            throw E({ ...ERROR.INVALID_CONTEXT })
        }

        CloudBase.scfContext = parseResult
        return parseResult
    }

    public config: ICloudBaseConfig
    public oldInstance: any // 灰度用旧sdk实例

    private clsLogger: Log

    public constructor(config?: ICloudBaseConfig) {
        this.init(config)
    }

    public init(config: ICloudBaseConfig = {}): void {
        let {
            secretId,
            secretKey,
            sessionToken,
            env,
            proxy,
            timeout,
            serviceUrl,
            version,
            headers = {},
            credentials,
            isHttp,
            throwOnCode,
            _useFeature
        } = config

        if ((secretId && !secretKey) || (!secretId && secretKey)) {
            throw E({
                ...ERROR.INVALID_PARAM,
                message: 'secretId and secretKey must be a pair'
            })
        }

        const newConfig: ICloudBaseConfig = {
            secretId: secretId,
            secretKey: secretKey,
            sessionToken: sessionToken,
            envName: env,
            proxy,
            isHttp,
            headers: { ...headers },
            timeout: timeout || 15000,
            serviceUrl,
            credentials,
            version,
            throwOnCode: throwOnCode !== undefined ? throwOnCode : true,
            _useFeature
        }

        this.config = newConfig

        // 设置旧实例
        this.oldInstance = tcb.init(config)
    }

    public database(dbConfig: any = {}): Db {
        Db.reqClass = DBRequest
        // 兼容方法预处理

        if (Object.prototype.toString.call(dbConfig).slice(8, -1) !== 'Object') {
            throw E({ ...ERROR.INVALID_PARAM, message: 'dbConfig must be an object' })
        }

        if (dbConfig && dbConfig.env) {
            // env变量名转换
            dbConfig.envName = dbConfig.env
            delete dbConfig.env
        }
        return new Db({
            ...this.config,
            ...dbConfig,
            _oldDbInstance: this.oldInstance.database(dbConfig)
        })
    }

    /**
     * 调用云函数
     *
     * @param param0
     * @param opts
     */
    public callFunction({ name, data }, opts?: ICustomReqOpts): Promise<any> {
        return this.preProcess(callFunction)({ name, data }, opts)
    }

    public auth(): any {
        return this.preProcess(auth)()
    }

    /**
     * openapi调用
     *
     * @param param0
     * @param opts
     */
    public callWxOpenApi({ apiName, requestData }, opts?: ICustomReqOpts): Promise<any> {
        return this.preProcess(callWxOpenApi)({ apiName, requestData }, opts)
    }

    /**
     * wxpayapi调用
     *
     * @param param0
     * @param opts
     */
    public callWxPayApi({ apiName, requestData }, opts?: ICustomReqOpts): Promise<any> {
        return this.preProcess(callWxPayApi)({ apiName, requestData }, opts)
    }

    /**
     * 微信云调用
     *
     * @param param0
     * @param opts
     */
    public callCompatibleWxOpenApi({ apiName, requestData }, opts?: ICustomReqOpts): Promise<any> {
        return this.preProcess(callCompatibleWxOpenApi)({ apiName, requestData }, opts)
    }

    /**
     * 上传文件
     *
     * @param param0
     * @param opts
     */
    public uploadFile({ cloudPath, fileContent }, opts?: ICustomReqOpts): Promise<IUploadFileRes> {
        return this.preProcess(uploadFile)({ cloudPath, fileContent }, opts)
    }

    /**
     * 删除文件
     *
     * @param param0
     * @param opts
     */
    public deleteFile(
        { fileList },
        opts?: ICustomReqOpts
    ): Promise<ICustomErrRes | IDeleteFileRes> {
        return this.preProcess(deleteFile)({ fileList }, opts)
    }

    /**
     * 获取临时连接
     *
     * @param param0
     * @param opts
     */
    public getTempFileURL(
        { fileList },
        opts?: ICustomReqOpts
    ): Promise<ICustomErrRes | IGetFileUrlRes> {
        return this.preProcess(getTempFileURL)({ fileList }, opts)
    }

    /**
     * 下载文件
     *
     * @param params
     * @param opts
     */
    public downloadFile(
        params: { fileID: string; tempFilePath?: string },
        opts?: ICustomReqOpts
    ): Promise<ICustomErrRes | IDownloadFileRes> {
        return this.preProcess(downloadFile)(params, opts)
    }

    /**
     * 获取上传元数据
     *
     * @param param0
     * @param opts
     */
    public getUploadMetadata({ cloudPath }, opts?: ICustomReqOpts): Promise<any> {
        return this.preProcess(getUploadMetadata)({ cloudPath }, opts)
    }

    /**
     * 获取logger
     *
     */
    public logger(): Log {
        if (!this.clsLogger) {
            this.clsLogger = this.preProcess(logger)()
        }
        return this.clsLogger
    }

    // 兼容处理旧sdk
    private preProcess(func: Function) {
        const self = this
        return function(...args) {
            // 默认使用旧tcb实例对象
            const oldInstance = self.oldInstance
            const functionName = func.name

            const oldFunc = oldInstance[functionName]
            // 检查用户是否主动设置走新逻辑
            if (self.config) {
                const { _useFeature } = self.config
                if (_useFeature === true) {
                    return func.call(self, self, ...args)
                }
            }

            if (checkIsGray()) {
                return func.call(self, self, ...args)
            }

            return oldFunc.call(oldInstance, ...args)
        }
    }
}
