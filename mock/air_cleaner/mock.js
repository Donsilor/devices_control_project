/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    switch: 'on',
    child_lock_switch: 'off',
    negative_ion_switch: 'off',
    control: 'auto',
    speed: 'low',
    air_filter_result: {
        "air_quality": ["high"],
        "PM25|0-300": 1
    },
    filter_time_remaining: '120',
    temperature: 30,
    humidity: 60
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        code: 0,
        result: {
            "device_name": "空气净化器",
            "attribute": res
        }
    })

}

export function set(data){
    var attr = data.params.attribute
    if(attr.speed){
        attr.control = 'manual'
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

