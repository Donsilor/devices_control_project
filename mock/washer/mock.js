/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    control: '',
    status: '',
    child_lock_switch: 'off',
    auto_detergent_switch: '',
    add_laundry_switch: '',
    mode: ''
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
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

