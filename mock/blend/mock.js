/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "progress": 60,
    "machine_mode": 'grains',
    "order_time": 440,
    "step": 3,
    "speed_tem": 10,
    "run_time": 40,
    "machine_status": 'standby',
    "order_mode": 'gruel',
    "realtime_tem": 79,
    "realtime_speed": 3,
    "no_cup": 'on',
    "dry_heat": 'on',
    "connectivity": "online"
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
    if(attr.control){
        attr.control_status = attr.control
    }
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

