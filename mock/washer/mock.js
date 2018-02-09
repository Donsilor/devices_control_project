/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    control: '',
    'switch': 'on',
    status: 'run',
    child_lock_switch: 'off',
    auto_detergent_switch: '',
    add_laundry_switch: '',
    mode: 'mix',
    time_use: '100',
    time_left: '80'
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
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
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

