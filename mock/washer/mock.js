/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    "add_laundry_switch": "off",
    "auto_detergent_switch": "off",
    "child_lock_switch": "off",
    "drying": "no_drying",
    "drying_duration": 15,
    "mode": "mix",
    "operation": "spin",
    "reserve_wash": 24,
    "spin": 0,
    "status": "standby",
    "sterilization": "off",
    "switch": "on",
    "temperature": 28,
    "time_left": 10
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "洗衣机",
            "attribute": res
        }
    })

}

export function set(data){
    var attr = data.params.attribute
    if(attr.control){
        attr.status = attr.control
        if(attr.status == 'start'){
            attr.status = 'run'
        }
        if(attr.status == 'halt'){
            attr.status = 'standby'
            attr.operation = 'wash'
        }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

