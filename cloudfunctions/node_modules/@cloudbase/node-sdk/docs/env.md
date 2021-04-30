#### 获取云函数执行的 env

```js
const tcb = require('@cloudbase/node-sdk')

/**
 * @returns string
 */
const env = tcb.SYMBOL_CURRENT_ENV
```

#### 解析云函数环境下的环境变量

```javascript
const tcb = require('@cloudbase/node-sdk')

const envObj = tcb.parseContext(context) // context 参数 取自云函数入口函数handler的context对象
```
