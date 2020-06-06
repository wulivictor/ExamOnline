import { IErrorInfo } from '../type';
export declare class TcbError extends Error {
    readonly code: string;
    readonly message: string;
    readonly requestId: string;
    constructor(error: IErrorInfo);
}
export declare const filterValue: (o: any, value: any) => void;
export declare const filterUndefined: (o: any) => void;
export declare const E: (errObj: IErrorInfo) => TcbError;
export declare const isArray: (arr: any) => boolean;
export declare const camSafeUrlEncode: (str: any) => string;
export declare const map: (obj: any, fn: any) => {};
export declare const clone: (obj: any) => {};
export declare const checkIsInScf: () => boolean;
export declare const delay: (ms: any) => Promise<unknown>;
export declare function second(): number;
export declare function processReturn(throwOnCode: boolean, res: any): any;
export declare function checkIsGray(): boolean;
export declare function getServerInjectUrl(): string;
export declare function getTcbContextConfig(): any;
export declare function getWxUrl(config: any): string;
