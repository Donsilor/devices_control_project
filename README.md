### 编译说明

```
npm run dev 产品名 参数
npm run build 产品名 参数
```

参数列表

- `-m` 移动端页面
- ~~`-w` 添加水印~~
  改为判断 app 注入变量(`user_name`和`phone`)

### 2019.4.28
- `-mock` 是否启用 mock 目前只适用 空调、窗帘、电视

  示例 npm run build air_condition -m -mock -debug

### 已对接品类

### 遗留问题

- 安卓是全屏布局，iOS 不包含底部菜单
- 告警统一封装处理
-

### history

### 2017.7.6

添加新的命令 npm run add <appName> 用于添加新的设备工程

### 2017.7.5

正式废弃原来的 getDeviceLog getDeviceMonthHistory getDeviceLogByDay
统一整合到 postRequest，并已经将项目的相关部分修改

### 2017.7.4

升级 webpack 2.0 => 3.0
增加 scope hoisting
移除生成产品阶段的 source map

### 2017.5.11

删除原文档书写方式，正式在代码中通过注释写文档

#### 2017.5.3

- 添加 sdk.debug.js 用于开发环境调试
- 修改项目名称与 app 端的 enum 保持一致

#### 2017.5.2

完成 sensor

#### 2017.4.27

- 初始化工程
- 迁移 sdk
- 迁移 curtain
- 迁移 door



### 设备文件目录
- 电视  src/other/tv_628_m
- 方太蒸箱 src/fangtai/fangtai_steam_cooker_m
- 虚拟体验窗帘
- 虚拟体验空调
- 格力空调
- 海尔洗碗机
- 箭牌马桶
- 杜亚窗帘  src\duya\new_curtains_m
- 泰创窗帘  src\taichuang\curtains_m
- 控客插座
- 热水器
- 博联空气云管家 /src/broadLink/air_quality_check_m
- 晾霸晾衣架 src/LBest/clothes_hanger_m
- 面板 src/others/panel_m/components
- 逸云灯 src/yiyun/yiyun_light_m
- 新头部组件 lib/components/NewTopBar
- 离线bannner组件 lib/components/StatusTip
- 帮助页面  lib/components/OfflineHelpPage



4.2.0版本需要上的设备

格兰仕空调 src\air_condition\galanz_air_condition2_m （后面有个2）
长虹空调 src\air_condition\changhong_air_condition_m （第一个）
康佳电视 src\konka\tv_control_m



















