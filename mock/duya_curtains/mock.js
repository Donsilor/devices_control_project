import Mock from 'mockjs'

let res = {
    "connectivity": "offline", //l
    "switch": 'off', //开关
    "open_percentage":100  , 
}
export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "客厅的窗帘",
            "device_uuid": 1222222,
            "attribute": res
        }
    })
}


export function generateNetwork() {
  return Mock.mock(-1)
}

export function set(data){
    var attr = data.params.attribute
    if(attr.negative_ion_switch){
        attr.negative_ion_switch_status = attr.negative_ion_switch
    }
    if(attr.switch){
        if (attr.switch=='on') {         
          // var num = 0  // 限制执行次数为5次
          // var timer = setInterval(function() {    
          //     if (num == 5) {
          //         clearInterval(timer)
          //     } else {
          //         num++
          //         console.log('定时器')
                  
          //         // 其他代码...
          //         res.open_percentage += 20
          //     }
          // }, 500)   
          attr.open_percentage= 100
        }
        if (attr.switch=='off') {
          attr.open_percentage= 0
        }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
