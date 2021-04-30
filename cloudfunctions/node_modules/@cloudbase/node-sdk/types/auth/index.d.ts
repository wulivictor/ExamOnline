import { CloudBase } from '../cloudbase';
export declare function auth(cloudbase: CloudBase): {
    getUserInfo(): {
        openId: string;
        appId: string;
        uid: string;
        customUserId: string;
        isAnonymous: boolean;
    };
    getAuthContext(context: any): Promise<any>;
    getClientIP(): string;
    createTicket: (uid: any, options?: any) => string;
};
