import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'on', //开关
    'control':'stop',
    'mode':'nomal',
    'operation_mode':'end',//洗涤状态
    'remain_washtime':'121',
    'return_standby':'off'
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
        attr.operation_mode= 'wash_inflow'
      }else{
        attr.operation_mode= 'standby'
      }
    }
    if(attr.operation_mode){
      if(attr.operation_mode=='start'){
        attr.remain_washtime = 121
      }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
