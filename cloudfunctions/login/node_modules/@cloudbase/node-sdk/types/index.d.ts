import { CloudBase } from './cloudbase';
import { ICloudBaseConfig, IContext } from './type';
declare const _default: {
    init: (config?: ICloudBaseConfig) => CloudBase;
    parseContext: (context: IContext) => IContext;
    /**
     * 云函数下获取当前env
     */
    SYMBOL_CURRENT_ENV: symbol;
};
export = _default;
