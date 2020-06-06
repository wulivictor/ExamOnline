"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const request_1 = __importDefault(require("request"));
const utils_1 = require("./utils");
exports.default = (opts, reqHooks) => {
    return new Promise((resolve, reject) => {
        request_1.default(opts, function (err, response, body) {
            if (err) {
                return reject(err);
            }
            if (response.statusCode === 200) {
                let res;
                try {
                    res = typeof body === 'string' ? JSON.parse(body) : body;
                    // wx.openApi 调用时，需用content-type区分buffer or JSON
                    if (reqHooks) {
                        const { handleData } = reqHooks;
                        if (handleData) {
                            res = handleData(res, err, response, body);
                        }
                    }
                }
                catch (e) {
                    res = body;
                }
                return resolve(res);
            }
            else {
                const e = utils_1.E({
                    code: response.statusCode,
                    message: ` ${response.statusCode} ${http_1.default.STATUS_CODES[response.statusCode]} | [url: ${opts.url}]`
                });
                reject(e);
            }
        });
    });
};
