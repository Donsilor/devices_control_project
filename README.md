### sdk js-sdk
```
    npm run dev:sdk //开发
    npm run build:sdk //编译
```
### window_curtains 窗帘
```
    npm run dev:window_curtains //开发
    npm run build:window_curtains //编译
```

### door_sensor 门窗传感器
```
    npm run dev:door_sensor //开发
    npm run build:door_sensor //编译
```


### human_sensor 人体传感器
```
    npm run dev:human_sensor //开发
    npm run build:human_sensor //编译
```

### humiture 温湿度传感器
```
    npm run dev:humiture //开发
    npm run build:humiture //编译
```

### air_condition 空调
```
    npm run dev:air_condition //开发
    npm run build:air_condition //编译
```

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
