/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "switch": 'on', //开关机: on--- 开启 off--- 关闭
    "status": 'start', //运行/停止/完成
    "control": '', //运行/停止/完成
    "reserve_bake": 1, //单位为分钟，表示从当前时间开始需要多长时间结束整个烘烤过程
    "remaining": 88, //预约剩余时间，单位为分钟
    "step": 'bake', //当前工作模式，烘烤/预约
    "mode": 'broil', //模式
    "temperature": 70, //设置温度
    "bake_duration": 390, //时长 单位是秒
    "convection": 'off', //开启, 关闭热风对流
    "rotisserie": 'off', //开启, 关闭转叉
    "child_lock":'off', //开关童锁
    "preheat": 'off', //开关辅助预热功能
    "connectivity": "online"
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "电烤箱",
            "attribute": res
        }
    })

}

export function set(data){
    var attr = data.params.attribute
    if(attr.control){
        // attr.status = attr.control
        if(attr.control == 'start'){
            attr.status = 'start'
        } else if(attr.control == 'stop') {
          attr.status = 'stop'
        }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

