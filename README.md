
### 编译说明
```
npm run dev 产品名 参数
npm run build 产品名 参数
```

参数列表
- `-m` 移动端页面
- ~~`-w` 添加水印~~
改为判断app注入变量(`user_name`和`phone`)

### 已对接品类

### 遗留问题
- 安卓是全屏布局，iOS不包含底部菜单
- 告警统一封装处理
-


### history
### 2017.7.6
添加新的命令npm run add <appName> 用于添加新的设备工程

### 2017.7.5
正式废弃原来的getDeviceLog getDeviceMonthHistory getDeviceLogByDay
统一整合到postRequest，并已经将项目的相关部分修改

### 2017.7.4
升级webpack 2.0 => 3.0
增加scope hoisting
移除生成产品阶段的source map

### 2017.5.11
删除原文档书写方式，正式在代码中通过注释写文档


#### 2017.5.3
- 添加sdk.debug.js 用于开发环境调试
- 修改项目名称与app端的enum保持一致

#### 2017.5.2
完成sensor

#### 2017.4.27
- 初始化工程
- 迁移sdk
- 迁移curtain
- 迁移door
