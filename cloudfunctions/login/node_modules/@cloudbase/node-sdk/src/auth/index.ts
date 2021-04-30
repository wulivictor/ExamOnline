import jwt from 'jsonwebtoken'
import { E } from '../utils/utils'
import { ERROR } from '../const/code'
import { CloudBase } from '../cloudbase'
import { SYMBOL_CURRENT_ENV } from '../const/symbol'

const checkCustomUserIdRegex = /^[a-zA-Z0-9_\-#@~=*(){}[\]:.,<>+]{4,32}$/

function validateUid(uid) {
    if (typeof uid !== 'string') {
        // console.log('debug:', { ...ERROR.INVALID_PARAM, message: 'uid must be a string' })
        throw E({ ...ERROR.INVALID_PARAM, message: 'uid must be a string' })
    }
    if (!checkCustomUserIdRegex.test(uid)) {
        throw E({ ...ERROR.INVALID_PARAM, message: `Invalid uid: "${uid}"` })
    }
}

export function auth(cloudbase: CloudBase) {
    return {
        getUserInfo() {
            const openId = process.env.WX_OPENID || ''
            const appId = process.env.WX_APPID || ''
            const uid = process.env.TCB_UUID || ''
            const customUserId = process.env.TCB_CUSTOM_USER_ID || ''
            const isAnonymous = process.env.TCB_ISANONYMOUS_USER === 'true' ? true : false

            return {
                openId,
                appId,
                uid,
                customUserId,
                isAnonymous
            }
        },
        async getAuthContext(context) {
            const { environment, environ } = CloudBase.parseContext(context)
            const env = environment || environ || {}
            const { TCB_UUID, LOGINTYPE } = env
            const res: any = {
                uid: TCB_UUID,
                loginType: LOGINTYPE
            }
            if (LOGINTYPE === 'QQ-MINI') {
                const { QQ_OPENID, QQ_APPID } = env
                res.appId = QQ_APPID
                res.openId = QQ_OPENID
            }
            return res
        },
        getClientIP() {
            return process.env.TCB_SOURCE_IP || ''
        },
        createTicket: (uid, options: any = {}) => {
            validateUid(uid)
            const timestamp = new Date().getTime()
            const { credentials } = cloudbase.config
            let { envName } = cloudbase.config
            if (!envName) {
                throw new Error('no env in config')
            }

            // 使用symbol时替换为环境变量内的env
            if (envName === SYMBOL_CURRENT_ENV) {
                envName = process.env.TCB_ENV || process.env.SCF_NAMESPACE
            }

            const { refresh = 3600 * 1000, expire = timestamp + 7 * 24 * 60 * 60 * 1000 } = options
            const token = jwt.sign(
                {
                    alg: 'RS256',
                    env: envName,
                    iat: timestamp,
                    exp: timestamp + 10 * 60 * 1000, // ticket十分钟有效
                    uid,
                    refresh,
                    expire
                },
                credentials.private_key,
                { algorithm: 'RS256' }
            )

            return credentials.private_key_id + '/@@/' + token
        }
    }
}
