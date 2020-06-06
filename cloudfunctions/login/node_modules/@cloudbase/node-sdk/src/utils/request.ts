import http from 'http'
import request from 'request'
import { IReqOpts, IReqHooks } from '../type/index'
import { E } from './utils'

export default (opts: IReqOpts, reqHooks?: IReqHooks): Promise<any> => {
    return new Promise((resolve, reject) => {
        request(opts, function(err, response, body) {
            if (err) {
                return reject(err)
            }

            if (response.statusCode === 200) {
                let res
                try {
                    res = typeof body === 'string' ? JSON.parse(body) : body
                    // wx.openApi 调用时，需用content-type区分buffer or JSON
                    if (reqHooks) {
                        const { handleData } = reqHooks
                        if (handleData) {
                            res = handleData(res, err, response, body)
                        }
                    }
                } catch (e) {
                    res = body
                }
                return resolve(res)
            } else {
                const e = E({
                    code: response.statusCode,
                    message: ` ${response.statusCode} ${
                        http.STATUS_CODES[response.statusCode]
                    } | [url: ${opts.url}]`
                })
                reject(e)
            }
        })
    })
}
