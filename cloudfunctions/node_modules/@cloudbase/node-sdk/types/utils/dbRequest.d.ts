import { ICustomReqOpts } from '../type';
/**
 * 数据库模块的通用请求方法
 *
 * @author haroldhu
 * @internal
 */
export declare class DBRequest {
    private config;
    /**
     * 初始化
     *
     * @internal
     * @param config
     */
    constructor(config: any);
    /**
     * 发送请求
     *
     * @param dbParams   - 数据库请求参数
     * @param opts  - 可选配置项
     */
    send(api: string, data: any, opts?: ICustomReqOpts): Promise<any>;
}
