/**
 * Created by lenovo on 2019/7/1.
 */
import Mock from 'mockjs'

let res = {
    "switch_status": "on",// 开/关机
    "anion_status": "off",// U V +负离子状态
    "childlock_status": "off",// 童锁状态
    "mode_status": "dehumidification",// 工作模式：自动/除湿/干衣
    "speed": "normal",// 风速：低/中/高
    "defrost": "off",// 除霜状态
    "sleep_mode": "off",// 睡眠模式：开/关
    "wind_direction": "off",// 摆角：未使用/45度/90度/自动
    "target_humidity": "50",// 目标湿度%
    "time_mode": "off",// 定时模式：开/关/无定时
    "time": "0",// 设定定时:0是无定时(秒)
    "env_humidity": "30",// 室内湿度%
    "env_temperature": "24",// 当前环境温度：只读, 单位为0.1摄氏度, 188就是18.8摄氏度
    "error_code": "normal",// 正常/水满报警/温湿度传感器故障/湿度传感器故障/温度传感器故障/自动关机保护/盘管传感器故障
    "alarm_cancel": "on",// 告警解除
    "water_full": "off",// 水满报警：告警触发/告警解除
    "th_fault": "off",// 温湿度传感器故障：告警触发/告警解除
    "temperature_fault": "off",// 湿度传感器故障：告警触发/告警解除
    "humidity_fault": "off",// 温度传感器故障：告警触发/告警解除
    "power_off": "off",// 自动关机保护：告警触发/告警解除
    "coil_fault": "off",// 盘管传感器故障：告警触发/告警解除
    "connectivity": "online"
  }

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "除湿机",
            "attribute": res
        }
    })
}

export function set(data){
    var attr = data.params.attribute
    if(attr.mode){
        attr.mode_status = attr.mode
    }
    if(attr.anion){
        attr.anion_status = attr.anion
    }
    if(attr.switch){
        attr.switch_status = attr.switch
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

