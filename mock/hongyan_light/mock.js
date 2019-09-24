import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch_status": 'on', //开关
    "temperature":167 , //暖光3000K  自然光5000K  白光6000K
    "level":200
}
export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "智能筒灯",
            "attribute": res
        }
    })
}

export function set(data){
    var attr = data.params.attribute
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
