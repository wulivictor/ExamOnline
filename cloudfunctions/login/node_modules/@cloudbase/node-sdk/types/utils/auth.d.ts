interface IAuthOpts {
    SecretId?: string;
    SecretKey?: string;
    Method?: string;
    Pathname?: string;
    Query?: Object;
    Headers?: Object;
    Expires?: number;
    expires?: number;
}
export declare class Auth {
    private opt;
    private qSignAlgorithm;
    constructor(opt: IAuthOpts);
    getAuth(): string;
    private getObjectKeys;
    private obj2str;
}
export {};
