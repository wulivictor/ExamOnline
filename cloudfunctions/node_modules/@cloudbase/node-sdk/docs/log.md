## 打印日志

```javascript
const tcb = require('@cloudbase/node-sdk')
const app = tcb.init()
let logMsg = {name: 'luke', age: '25'} // msg必须为对象

// 输出log级别
app.logger().log(logMsg)

// 输出warn级别
app.logger().warn(logMsg)

// 输出error级别
app.logger().error(logMsg)

// 输出info级别
app.logger().info(logMsg)
```
