"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils/utils");
const code_1 = require("../const/code");
const cloudbase_1 = require("../cloudbase");
const symbol_1 = require("../const/symbol");
const checkCustomUserIdRegex = /^[a-zA-Z0-9_\-#@~=*(){}[\]:.,<>+]{4,32}$/;
function validateUid(uid) {
    if (typeof uid !== 'string') {
        // console.log('debug:', { ...ERROR.INVALID_PARAM, message: 'uid must be a string' })
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'uid must be a string' }));
    }
    if (!checkCustomUserIdRegex.test(uid)) {
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: `Invalid uid: "${uid}"` }));
    }
}
function auth(cloudbase) {
    return {
        getUserInfo() {
            const openId = process.env.WX_OPENID || '';
            const appId = process.env.WX_APPID || '';
            const uid = process.env.TCB_UUID || '';
            const customUserId = process.env.TCB_CUSTOM_USER_ID || '';
            const isAnonymous = process.env.TCB_ISANONYMOUS_USER === 'true' ? true : false;
            return {
                openId,
                appId,
                uid,
                customUserId,
                isAnonymous
            };
        },
        async getAuthContext(context) {
            const { environment, environ } = cloudbase_1.CloudBase.parseContext(context);
            const env = environment || environ || {};
            const { TCB_UUID, LOGINTYPE } = env;
            const res = {
                uid: TCB_UUID,
                loginType: LOGINTYPE
            };
            if (LOGINTYPE === 'QQ-MINI') {
                const { QQ_OPENID, QQ_APPID } = env;
                res.appId = QQ_APPID;
                res.openId = QQ_OPENID;
            }
            return res;
        },
        getClientIP() {
            return process.env.TCB_SOURCE_IP || '';
        },
        createTicket: (uid, options = {}) => {
            validateUid(uid);
            const timestamp = new Date().getTime();
            const { credentials } = cloudbase.config;
            let { envName } = cloudbase.config;
            if (!envName) {
                throw new Error('no env in config');
            }
            // 使用symbol时替换为环境变量内的env
            if (envName === symbol_1.SYMBOL_CURRENT_ENV) {
                envName = process.env.TCB_ENV || process.env.SCF_NAMESPACE;
            }
            const { refresh = 3600 * 1000, expire = timestamp + 7 * 24 * 60 * 60 * 1000 } = options;
            const token = jsonwebtoken_1.default.sign({
                alg: 'RS256',
                env: envName,
                iat: timestamp,
                exp: timestamp + 10 * 60 * 1000,
                uid,
                refresh,
                expire
            }, credentials.private_key, { algorithm: 'RS256' });
            return credentials.private_key_id + '/@@/' + token;
        }
    };
}
exports.auth = auth;
