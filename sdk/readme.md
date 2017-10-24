# JS SDK
> 实现app和h5通信

## 目录结构说明

 - app 提供mock数据的接口
 - src 源代码
 - dist 编译后代码
 - index.html demo页面


## 存在问题

- alert 没有回调
- toast 参数格式和其他方法不同
- setWebViewTouchRect 没有用
- toggleHeadAndFoot 建议做成配置(foot已改成一直显示)
- control 空调和窗帘参数和返回值区别很大(一个是wifi设备，一个是ZigBee设备)。code=504为窗帘出错码，其他成功；code=0为空调成功码，其他失败
- getNetworkType、post、reload、sendNotification 无效
- dispatchEvent、postRequest 待定
- ready延迟100ms执行(窗帘会出错，没有设备，暂未解决)
