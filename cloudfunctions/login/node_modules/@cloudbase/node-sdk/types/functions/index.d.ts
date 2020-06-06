import { ICustomReqOpts } from '../type';
import { CloudBase } from '../cloudbase';
/**
 * 调用云函数
 * @param {String} name  函数名
 * @param {Object} functionParam 函数参数
 * @return {Promise}
 */
export declare function callFunction(cloudbase: CloudBase, { name, data }: {
    name: any;
    data: any;
}, opts?: ICustomReqOpts): Promise<any>;
