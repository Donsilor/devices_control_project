
import Mock from 'mockjs';

var res = {
    "mode": "half_tank",
    "switch": "on"
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        code: 0,
        result: {
            "device_name": "热水器",
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

