"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cloudbase_1 = require("./cloudbase");
const symbol_1 = require("./const/symbol");
const tcb_admin_node_1 = __importDefault(require("tcb-admin-node"));
module.exports = {
    init: (config) => {
        if (config) {
            const { _useFeature } = config;
            if (_useFeature === false) {
                // 设置用老实例
                return tcb_admin_node_1.default.init(config);
            }
        }
        return new cloudbase_1.CloudBase(config);
    },
    parseContext: (context) => {
        // 校验context 是否正确
        return cloudbase_1.CloudBase.parseContext(context);
    },
    /**
     * 云函数下获取当前env
     */
    SYMBOL_CURRENT_ENV: symbol_1.SYMBOL_CURRENT_ENV
};
