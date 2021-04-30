import { ICustomReqOpts, ICustomErrRes, IDeleteFileRes, IGetFileUrlRes, IDownloadFileRes, IUploadFileRes, IErrorInfo } from '../type';
import { CloudBase } from '../cloudbase';
export declare function parseXML(str: any): Promise<unknown>;
export declare function uploadFile(cloudbase: CloudBase, { cloudPath, fileContent }: {
    cloudPath: any;
    fileContent: any;
}, opts?: ICustomReqOpts): Promise<IUploadFileRes | IErrorInfo>;
/**
 * 删除文件
 * @param {Array.<string>} fileList 文件id数组
 */
export declare function deleteFile(cloudbase: CloudBase, { fileList }: {
    fileList: any;
}, opts?: ICustomReqOpts): Promise<ICustomErrRes | IDeleteFileRes>;
/**
 * 获取文件下载链接
 * @param {Array.<Object>} fileList
 */
export declare function getTempFileURL(cloudbase: CloudBase, { fileList }: {
    fileList: any;
}, opts?: ICustomReqOpts): Promise<ICustomErrRes | IGetFileUrlRes>;
export declare function downloadFile(cloudbase: CloudBase, params: {
    fileID: string;
    tempFilePath?: string;
}, opts?: ICustomReqOpts): Promise<ICustomErrRes | IDownloadFileRes>;
export declare function getUploadMetadata(cloudbase: CloudBase, { cloudPath }: {
    cloudPath: any;
}, opts?: ICustomReqOpts): Promise<any>;
export declare function getFileAuthority(cloudbase: CloudBase, { fileList }: {
    fileList: any;
}): Promise<any>;
