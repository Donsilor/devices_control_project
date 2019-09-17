import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'off', //开关
    "temperature":3000 , //暖光3000K  自然光5000K  白光6000K
    "level":20
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
