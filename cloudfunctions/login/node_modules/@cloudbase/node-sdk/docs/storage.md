## 存储

<!-- TOC -->

- [上传文件](#上传文件)
- [获取文件下载链接](#获取文件下载链接)
- [删除文件](#删除文件)
- [下载文件](#下载文件)

<!-- /TOC -->

### 上传文件

uploadFile(object)

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| object | Object | 是 | 上传文件请求参数
| opts | Object | 否 | 自定义配置，目前只支持超时时间设置，{timeout: number}

请求参数 object

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| cloudPath | string | 是 | 文件的绝对路径，包含文件名。例如foo/bar.jpg、foo/bar/baz.jpg等，不能包含除[0-9 , a-z , A-Z]、/、!、-、_、.、、*和中文以外的字符，使用 / 字符来实现类似传统文件系统的层级结构。[查看详情](https://cloud.tencent.com/document/product/436/13324)
| fileContent | fs.ReadStream | 是 | buffer或要上传的文件[可读流](https://nodejs.org/api/stream.html#stream_class_stream_readable)

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则不返回
| message | string | 否 | 错误描述
| fileID | fileID | 是 | 文件唯一ID，用来访问文件，建议存储起来
| requestId | string | 否 | 请求序列号，用于错误排查

示例代码

```javascript
const tcb = require("@cloudbase/node-sdk");
const app = tcb.init()
const fs = require("fs");

let result = await app.uploadFile({
    cloudPath: "test-admin.jpeg",
    fileContent: fs.createReadStream(`${__dirname}/cos.jpeg`)
});

// 设置自定义超时时间
let result = await app.uploadFile({
    cloudPath: "test-admin.jpeg",
    fileContent: fs.createReadStream(`${__dirname}/cos.jpeg`)
}, {
  timeout: 5000
});

```



### 获取文件下载链接

getTempFileURL(object)

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| object | Object | 是 | 获取下载链接请求参数
| opts | Object | 否 | 自定义配置，目前只支持超时时间设置，{timeout: number}

请求参数 object

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileList | &lt;Array&gt;.string | 是 | 要下载的文件ID组成的数组

fileList

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileID | string | 是 | 文件ID
| maxAge | Integer | 是 | 文件链接有效期

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则为SUCCESS
| message | string | 否 | 错误描述
| fileList | &lt;Array&gt;.object | 否 | 存储下载链接的数组
| requestId | string | 否 | 请求序列号，用于错误排查

fileList

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 删除结果，成功为SUCCESS
| fileID | string | 是 | 文件ID
| tempFileURL | string | 是 | 文件访问链接

示例代码

```javascript
let result = await app.getTempFileURL({
    fileList: ['cloud://test-28farb/a.png']
});

// 设置自定义超时时间
let result = await app.getTempFileURL({
    fileList: ['cloud://test-28farb/a.png']
}, {
  timeout: 5000
});
```

### 删除文件

deletfile(object)

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| object | Object | 是 | 删除文件请求参数
| opts | Object | 否 | 自定义配置，目前只支持超时时间设置，{timeout: number}

请求参数 object

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileList | &lt;Array&gt;.string | 是 | 要删除的文件ID组成的数组

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则不返回
| message | string | 否 | 错误描述
| fileList | &lt;Array&gt;.object | 否 | 删除结果组成的数组
| requestId | string | 否 | 请求序列号，用于错误排查

fileList

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 删除结果，成功为SUCCESS
| fileID | string | 是 | 文件ID

示例代码

```javascript
let result = await app.deleteFile({
    fileList: [
        "HHOeahVQ0fRTDsums4GVgMCsF6CE3wb7kmIkZbX+yilTJE4NPSQQW5EYks"
    ]
});

// 设置自定义超时
let result = await app.deleteFile({
    fileList: [
        "HHOeahVQ0fRTDsums4GVgMCsF6CE3wb7kmIkZbX+yilTJE4NPSQQW5EYks"
    ]
}, {
  timeout: 5000
});
```

### 下载文件

downloadFile(object)

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| object | Object | 是 | 下载文件请求参数
| opts | Object | 否 | 自定义配置，目前只支持超时时间设置，{timeout: number}

请求参数 object

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| fileID | string | 是 | 要下载的文件的id
| tempFilePath | string | 否 | 下载的文件要存储的位置

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | --- |
| code | string | 否 | 状态码，操作成功则不返回
| message | string | 否 | 错误描述
| fileContent | Buffer | 否 | 下载的文件的内容。如果传入tempFilePath则不返回该字段
| requestId | string | 否 | 请求序列号，用于错误排查

示例代码

```javascript
let result = await app.downloadFile({
    fileID: "cloud://aa-99j9f/my-photo.png",
    // tempFilePath: '/tmp/test/storage/my-photo.png'
});

// 自定义超时
let result = await app.downloadFile({
    fileID: "cloud://aa-99j9f/my-photo.png",
    // tempFilePath: '/tmp/test/storage/my-photo.png'
}, {
  timeout: 5000
});
```
