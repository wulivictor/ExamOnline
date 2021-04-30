import { IErrorInfo } from '../type'

const GRAY_ENV_KEY = 'TCB_SDK_GRAY_0'

export class TcbError extends Error {
    public readonly code: string
    public readonly message: string
    public readonly requestId: string

    public constructor(error: IErrorInfo) {
        super(error.message)
        this.code = error.code
        this.message = error.message
        this.requestId = error.requestId
    }
}

export const filterValue = function filterValue(o, value) {
    for (let key in o) {
        if (o[key] === value) {
            delete o[key]
        }
    }
}

export const filterUndefined = function(o) {
    return filterValue(o, undefined)
}

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

export const E = (errObj: IErrorInfo) => {
    return new TcbError(errObj)
}

export const isArray = arr => {
    return arr instanceof Array
}

export const camSafeUrlEncode = str => {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
}

export const map = (obj, fn) => {
    const o = isArray(obj) ? [] : {}
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = fn(obj[i], i)
        }
    }
    return o
}

export const clone = obj => {
    return map(obj, function(v) {
        return typeof v === 'object' && v !== undefined && v !== null ? clone(v) : v
    })
}

export const checkIsInScf = () => {
    return process.env.TENCENTCLOUD_RUNENV === 'SCF'
}

export const delay = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function second(): number {
    // istanbul ignore next
    return Math.floor(new Date().getTime() / 1000)
}

export function processReturn(throwOnCode: boolean, res: any) {
    if (throwOnCode === false) {
        // 不抛报错，正常return，兼容旧逻辑
        return res
    }

    throw E({ ...res })
}

export function checkIsGray(): boolean {
    const tcbContextConfig = getTcbContextConfig()
    return tcbContextConfig[GRAY_ENV_KEY] === true
}

export function getServerInjectUrl(): string {
    const tcbContextConfig = getTcbContextConfig()
    return tcbContextConfig['URL'] || ''
}

export function getTcbContextConfig(): any {
    try {
        if (process.env.TCB_CONTEXT_CNFG) {
            // 检查约定环境变量字段是否存在
            return JSON.parse(process.env.TCB_CONTEXT_CNFG)
        }
        return {}
    } catch (e) {
        console.log('parse context error...')
        return {}
    }
}

export function getWxUrl(config: any): string {
    const protocal = config.isHttp === true ? 'http' : 'https'
    let wxUrl = protocal + '://tcb-open.tencentcloudapi.com/admin'
    if (checkIsInScf()) {
        wxUrl = 'http://tcb-open.tencentyun.com/admin'
    }
    return wxUrl
}
