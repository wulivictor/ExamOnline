import { ICustomReqOpts } from '../type/index';
import { CloudBase } from '../cloudbase';
/**
 * 调用AI服务
 * @param {Object} param  AI 服务参数
 * @return {Promise}
 */
export declare function callAI(cloudbase: CloudBase, { param }: {
    param: any;
}, opts: ICustomReqOpts): Promise<any>;
