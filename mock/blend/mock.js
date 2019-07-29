/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "progress": 60,
    "machine_mode": 'grains',
    "order_time": 0,
    "step": 3,
    "speed_tem": 10,
    "run_time": 1800,
    "machine_status": 'grains',
    "order_mode": 'off',
    "realtime_tem": 79,
    "realtime_speed": 3,
    "no_cup": 'on',
    "dry_heat": 'on',
    "connectivity": "online",
    "h-t10": "30",
    "h-t11": "00",
    "remaining_run_time": "24:28"//模拟的剩余运行时间
  }

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "破壁机",
            "attribute": res
        }
    })
}

export function set(data){
    var attr = data.params.attribute
    // if(attr.order_mode){
    //     attr.machine_status = attr.order_mode
    //     attr.machine_mode = attr.order_mode
    // }
  //   if(attr.machine_mode){
  //     attr.order_mode = attr.machine_mode
  // }
    if(attr.negative_ion_switch){
        attr.negative_ion_switch_status = attr.negative_ion_switch
    }
    if(attr.switch){
        attr.switch_status = attr.switch
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

