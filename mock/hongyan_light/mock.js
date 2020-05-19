import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch_status": 'on', //开关
    "temperature":167 , //暖光3000K  自然光5000K  白光6000K
    "level":254,
    "mode": '2'
}
export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "智能筒灯",
            "device_uuid":43434,
            "room_name": "客厅",

            "attribute": res,
            "third_attribute": {
              "sub_device_category": "01"
            }
        }
    })
}
export function generateNetwork() {
  return Mock.mock(0)
}
export function generateViewHelp() {
  return Mock.mock({
    "content":"请依次尝试以下操作：\n1. 请检查开关电源指示灯是否开启，或是否能通过物理按键直接操控设备，确保设备供电正常。\n2. 若5分钟后仍未恢复上线状态，请前往设备管理，删除该设备后，再重新添加。"
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
