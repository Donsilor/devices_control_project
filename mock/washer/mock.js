/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    control: '',
    'switch': 'on',
    status: 'standby',
    operation: 'finish',
    child_lock_switch: 'off',
    auto_detergent_switch: '',
    add_laundry_switch: '',
    mode: 'mix',
    time_use: '100',
    time_left: '80',
    reserve_wash: 8,
    temperature: 0,
    drying: ''
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

