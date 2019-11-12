import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'on', //开关
    'control':'halt',
    'mode':'nomal',
    'operation_mode':'standby',//洗涤状态
    // 'remain_washtime':'121',
    'remaining':121,
    'return_standby':'off',
    'mode_status':'off',//程序是否运行
    'hardness_level':2,//水软
    'brightener_weight':1,//光亮剂0-255
    'childlock':'off'//童锁
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
        attr.remaining = 121
        attr.operation_mode= 'wash_inflow'
        attr.mode_status= 'on'
      }else{
        attr.operation_mode= 'standby'
      }
    }
    if(attr.mode){
      if (attr.mode == 'glass') {
         attr.operation_mode = 'end'
      }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
