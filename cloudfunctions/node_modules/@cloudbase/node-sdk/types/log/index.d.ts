/**
 *
 *
 * @class Log
 */
export declare class Log {
    isSupportClsReport: boolean;
    private src;
    constructor();
    /**
     *
     *
     * @param {*} logMsg
     * @param {*} logLevel
     * @returns
     * @memberof Log
     */
    transformMsg(logMsg: any): {};
    /**
     *
     *
     * @param {*} logMsg
     * @param {*} logLevel
     * @memberof Log
     */
    baseLog(logMsg: any, logLevel: any): void;
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    log(logMsg: any): void;
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    info(logMsg: any): void;
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    error(logMsg: any): void;
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    warn(logMsg: any): void;
}
export declare function logger(): Log;
