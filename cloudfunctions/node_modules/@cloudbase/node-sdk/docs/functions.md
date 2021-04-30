## 云函数

### 执行函数
callFunction(object)

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| object | Object | 是 | 云函数请求对象
| opts | Object | 否 | 自定义配置，目前只支持超时时间设置，{timeout: number}

请求参数 object

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| name | string | 是 | 云函数名称
| data | object | 否 | 云函数参数

响应参数

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| code | string | 否 | 状态码，操作成功则不返回
| message | string | 否 | 错误描述
| result | object | 否 | 云函数执行结果
| requestId | string | 否 | 请求序列号，用于错误排查

示例代码

```javascript
const tcb = require("@cloudbase/node-sdk");
const app = tcb.init()
let result = await app.callFunction({
    name: "test",
    data: { a: 1 }
});
```

调用云函数设置自定义超时
```javascript
const tcb = require("@cloudbase/node-sdk");
const app = tcb.init()
let result = await app.callFunction({
    name: "test",
    data: { a: 1 }
}, {
  timeout: 5000
});
```


