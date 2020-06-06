"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GRAY_ENV_KEY = 'TCB_SDK_GRAY_0';
class TcbError extends Error {
    constructor(error) {
        super(error.message);
        this.code = error.code;
        this.message = error.message;
        this.requestId = error.requestId;
    }
}
exports.TcbError = TcbError;
exports.filterValue = function filterValue(o, value) {
    for (let key in o) {
        if (o[key] === value) {
            delete o[key];
        }
    }
};
exports.filterUndefined = function (o) {
    return exports.filterValue(o, undefined);
};
// export const filterNull = function(o) {
//   return filterValue(o, null)
// }
// export const filterEmptyString = function(o) {
//   return filterValue(o, '')
// }
// export const warpPromise = function warp(fn) {
//   return function(...args) {
//     // 确保返回 Promise 实例
//     return new Promise((resolve, reject) => {
//       try {
//         return fn(...args)
//           .then(resolve)
//           .catch(reject)
//       } catch (e) {
//         reject(e)
//       }
//     })
//   }
// }
exports.E = (errObj) => {
    return new TcbError(errObj);
};
exports.isArray = arr => {
    return arr instanceof Array;
};
exports.camSafeUrlEncode = str => {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
};
exports.map = (obj, fn) => {
    const o = exports.isArray(obj) ? [] : {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = fn(obj[i], i);
        }
    }
    return o;
};
exports.clone = obj => {
    return exports.map(obj, function (v) {
        return typeof v === 'object' && v !== undefined && v !== null ? exports.clone(v) : v;
    });
};
exports.checkIsInScf = () => {
    return process.env.TENCENTCLOUD_RUNENV === 'SCF';
};
exports.delay = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
function second() {
    // istanbul ignore next
    return Math.floor(new Date().getTime() / 1000);
}
exports.second = second;
function processReturn(throwOnCode, res) {
    if (throwOnCode === false) {
        // 不抛报错，正常return，兼容旧逻辑
        return res;
    }
    throw exports.E(Object.assign({}, res));
}
exports.processReturn = processReturn;
function checkIsGray() {
    const tcbContextConfig = getTcbContextConfig();
    return tcbContextConfig[GRAY_ENV_KEY] === true;
}
exports.checkIsGray = checkIsGray;
function getServerInjectUrl() {
    const tcbContextConfig = getTcbContextConfig();
    return tcbContextConfig['URL'] || '';
}
exports.getServerInjectUrl = getServerInjectUrl;
function getTcbContextConfig() {
    try {
        if (process.env.TCB_CONTEXT_CNFG) {
            // 检查约定环境变量字段是否存在
            return JSON.parse(process.env.TCB_CONTEXT_CNFG);
        }
        return {};
    }
    catch (e) {
        console.log('parse context error...');
        return {};
    }
}
exports.getTcbContextConfig = getTcbContextConfig;
function getWxUrl(config) {
    const protocal = config.isHttp === true ? 'http' : 'https';
    let wxUrl = protocal + '://tcb-open.tencentcloudapi.com/admin';
    if (exports.checkIsInScf()) {
        wxUrl = 'http://tcb-open.tencentyun.com/admin';
    }
    return wxUrl;
}
exports.getWxUrl = getWxUrl;
