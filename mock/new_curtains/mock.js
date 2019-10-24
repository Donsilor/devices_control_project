import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'off', //开关
    "open_percentage":0 , 
}
export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "客厅的窗帘",
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
        if (attr.switch=='on') {
          var a = setInterval(() => {
            attr.open_percentage +=20
            if (attr.open_percentage === 100) {
              clearInterval(a)
            }
          }, 100)
          
        }
        if (attr.switch=='off') {
          attr.open_percentage= 20
        }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
