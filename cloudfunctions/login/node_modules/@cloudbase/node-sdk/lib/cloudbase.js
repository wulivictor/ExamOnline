"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@cloudbase/database");
const functions_1 = require("./functions");
const auth_1 = require("./auth");
const wx_1 = require("./wx");
const storage_1 = require("./storage");
const dbRequest_1 = require("./utils/dbRequest");
const log_1 = require("./log");
const code_1 = require("./const/code");
const utils_1 = require("./utils/utils");
const tcb_admin_node_1 = __importDefault(require("tcb-admin-node"));
const GRAY_ENV_KEY = 'TCB_SDK_GRAY_0';
class CloudBase {
    constructor(config) {
        this.init(config);
    }
    static parseContext(context) {
        if (typeof context !== 'object') {
            throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_CONTEXT), { message: 'context 必须为对象类型' }));
        }
        let { memory_limit_in_mb, time_limit_in_ms, request_id, environ, function_version, namespace, function_name, environment } = context;
        let parseResult = {};
        try {
            parseResult.memoryLimitInMb = memory_limit_in_mb;
            parseResult.timeLimitIns = time_limit_in_ms;
            parseResult.requestId = request_id;
            parseResult.functionVersion = function_version;
            parseResult.namespace = namespace;
            parseResult.functionName = function_name;
            // 存在environment 为新架构 上新字段 JSON序列化字符串
            if (environment) {
                parseResult.environment = JSON.parse(environment);
                return parseResult;
            }
            // 不存在environment 则为老字段，老架构上存在bug，无法识别value含特殊字符(若允许特殊字符，影响解析，这里特殊处理)
            const parseEnviron = environ.split(';');
            let parseEnvironObj = {};
            for (let i in parseEnviron) {
                // value含分号影响切割，未找到= 均忽略
                if (parseEnviron[i].indexOf('=') >= 0) {
                    const equalIndex = parseEnviron[i].indexOf('=');
                    const key = parseEnviron[i].slice(0, equalIndex);
                    let value = parseEnviron[i].slice(equalIndex + 1);
                    // value 含, 为数组
                    if (value.indexOf(',') >= 0) {
                        value = value.split(',');
                    }
                    parseEnvironObj[key] = value;
                }
            }
            parseResult.environ = parseEnvironObj;
        }
        catch (err) {
            throw utils_1.E(Object.assign({}, code_1.ERROR.INVALID_CONTEXT));
        }
        CloudBase.scfContext = parseResult;
        return parseResult;
    }
    init(config = {}) {
        let { secretId, secretKey, sessionToken, env, proxy, timeout, serviceUrl, version, headers = {}, credentials, isHttp, throwOnCode, _useFeature } = config;
        if ((secretId && !secretKey) || (!secretId && secretKey)) {
            throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'secretId and secretKey must be a pair' }));
        }
        const newConfig = {
            secretId: secretId,
            secretKey: secretKey,
            sessionToken: sessionToken,
            envName: env,
            proxy,
            isHttp,
            headers: Object.assign({}, headers),
            timeout: timeout || 15000,
            serviceUrl,
            credentials,
            version,
            throwOnCode: throwOnCode !== undefined ? throwOnCode : true,
            _useFeature
        };
        this.config = newConfig;
        // 设置旧实例
        this.oldInstance = tcb_admin_node_1.default.init(config);
    }
    database(dbConfig = {}) {
        database_1.Db.reqClass = dbRequest_1.DBRequest;
        // 兼容方法预处理
        if (Object.prototype.toString.call(dbConfig).slice(8, -1) !== 'Object') {
            throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'dbConfig must be an object' }));
        }
        if (dbConfig && dbConfig.env) {
            // env变量名转换
            dbConfig.envName = dbConfig.env;
            delete dbConfig.env;
        }
        return new database_1.Db(Object.assign(Object.assign(Object.assign({}, this.config), dbConfig), { _oldDbInstance: this.oldInstance.database(dbConfig) }));
    }
    /**
     * 调用云函数
     *
     * @param param0
     * @param opts
     */
    callFunction({ name, data }, opts) {
        return this.preProcess(functions_1.callFunction)({ name, data }, opts);
    }
    auth() {
        return this.preProcess(auth_1.auth)();
    }
    /**
     * openapi调用
     *
     * @param param0
     * @param opts
     */
    callWxOpenApi({ apiName, requestData }, opts) {
        return this.preProcess(wx_1.callWxOpenApi)({ apiName, requestData }, opts);
    }
    /**
     * wxpayapi调用
     *
     * @param param0
     * @param opts
     */
    callWxPayApi({ apiName, requestData }, opts) {
        return this.preProcess(wx_1.callWxPayApi)({ apiName, requestData }, opts);
    }
    /**
     * 微信云调用
     *
     * @param param0
     * @param opts
     */
    callCompatibleWxOpenApi({ apiName, requestData }, opts) {
        return this.preProcess(wx_1.callCompatibleWxOpenApi)({ apiName, requestData }, opts);
    }
    /**
     * 上传文件
     *
     * @param param0
     * @param opts
     */
    uploadFile({ cloudPath, fileContent }, opts) {
        return this.preProcess(storage_1.uploadFile)({ cloudPath, fileContent }, opts);
    }
    /**
     * 删除文件
     *
     * @param param0
     * @param opts
     */
    deleteFile({ fileList }, opts) {
        return this.preProcess(storage_1.deleteFile)({ fileList }, opts);
    }
    /**
     * 获取临时连接
     *
     * @param param0
     * @param opts
     */
    getTempFileURL({ fileList }, opts) {
        return this.preProcess(storage_1.getTempFileURL)({ fileList }, opts);
    }
    /**
     * 下载文件
     *
     * @param params
     * @param opts
     */
    downloadFile(params, opts) {
        return this.preProcess(storage_1.downloadFile)(params, opts);
    }
    /**
     * 获取上传元数据
     *
     * @param param0
     * @param opts
     */
    getUploadMetadata({ cloudPath }, opts) {
        return this.preProcess(storage_1.getUploadMetadata)({ cloudPath }, opts);
    }
    /**
     * 获取logger
     *
     */
    logger() {
        if (!this.clsLogger) {
            this.clsLogger = this.preProcess(log_1.logger)();
        }
        return this.clsLogger;
    }
    // 兼容处理旧sdk
    preProcess(func) {
        const self = this;
        return function (...args) {
            // 默认使用旧tcb实例对象
            const oldInstance = self.oldInstance;
            const functionName = func.name;
            const oldFunc = oldInstance[functionName];
            // 检查用户是否主动设置走新逻辑
            if (self.config) {
                const { _useFeature } = self.config;
                if (_useFeature === true) {
                    return func.call(self, self, ...args);
                }
            }
            if (utils_1.checkIsGray()) {
                return func.call(self, self, ...args);
            }
            return oldFunc.call(oldInstance, ...args);
        };
    }
}
exports.CloudBase = CloudBase;
