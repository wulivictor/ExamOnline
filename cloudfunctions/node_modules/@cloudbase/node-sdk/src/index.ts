import { CloudBase } from './cloudbase'
import { ICloudBaseConfig, IContext } from './type'
import { SYMBOL_CURRENT_ENV } from './const/symbol'
import tcb from 'tcb-admin-node'

export = {
    init: (config?: ICloudBaseConfig): CloudBase => {
        if (config) {
            const { _useFeature } = config
            if (_useFeature === false) {
                // 设置用老实例
                return tcb.init(config)
            }
        }
        return new CloudBase(config)
    },
    parseContext: (context: IContext) => {
        // 校验context 是否正确
        return CloudBase.parseContext(context)
    },
    /**
     * 云函数下获取当前env
     */
    SYMBOL_CURRENT_ENV: SYMBOL_CURRENT_ENV
}
