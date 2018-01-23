/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    control: '',
    'switch': 'on',
    status: 'halt',
    child_lock_switch: 'off',
    auto_detergent_switch: '',
    add_laundry_switch: '',
    mode: 'mix'
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
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

