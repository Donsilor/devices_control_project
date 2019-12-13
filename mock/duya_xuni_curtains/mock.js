import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'off', //开关
    "open_percentage":60,
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
  console.log('set调用', data)
  var attr = data.params.attribute
    if(attr.negative_ion_switch){
        attr.negative_ion_switch_status = attr.negative_ion_switch
    }
    if(attr.switch){
        console.log('switch调用', attr.switch)
        if (attr.switch=='on') {
          attr.open_percentage= 0
        }
        if (attr.switch=='off') {
          attr.open_percentage= 100
        }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
