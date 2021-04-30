/// <reference types="node" />
import { IRequestInfo, IReqOpts } from '../type/index';
export declare class Request {
    private args;
    private config;
    private defaultEndPoint;
    private inScfHost;
    private urlPath;
    private defaultTimeout;
    private timestamp;
    private tracingInfo;
    constructor(args: IRequestInfo);
    /**
     *
     * 接口action
     */
    getAction(): string;
    /**
     * 设置超时warning
     */
    setSlowRequeryWarning(action: string): NodeJS.Timer;
    /**
     * 构造params
     */
    getParams(): any;
    /**
     *  构造请求项
     */
    makeReqOpts(): IReqOpts;
    /**
     * 协议
     */
    private getProtocol;
    /**
     * 请求方法
     */
    private getMethod;
    /**
     * 超时时间
     */
    private getTimeout;
    /**
     * 获取
     */
    /**
     * 校验密钥和token是否存在
     */
    private validateSecretIdAndKey;
    /**
     *
     * 获取headers 此函数中设置authorization
     */
    private getHeaders;
    /**
     * 获取url
     * @param action
     */
    private getUrl;
}
declare const _default: (args: IRequestInfo) => Promise<any>;
export default _default;
