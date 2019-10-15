import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'off', //开关
    'control':'stop',
    'remain_washtime':'0',
    "open_pencentage":0 , //暖光3000K  自然光5000K  白光6000K
}
export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "厨房的洗碗机",
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
    if(attr.control){
      if(attr.control=='start'){
        attr.remain_washtime = 121
      }
        
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
