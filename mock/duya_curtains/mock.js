import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
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
  return Mock.mock(0)
}
export function generateViewHelp() {
  return Mock.mock({
    "router_content":"请依次尝试以下操作：\n1.请检查路由器指示灯是否亮起，确保路由器供电正常。\n2.检查路由器是否网络通畅，您可依次检查：\n  2.1 路由器网线是否插好；\n  2.2 请在我的家庭菜单中进入家庭路由器管理，在上                  网方式设置中检查您的宽带账号及密码是否与运营商提供的账号密码一致，若您忘记密码请联系运营商。",
    "content":"请依次尝试以下操作：\n1. 请检查开关电源指示灯是否开启，或是否能通过物理按键直接操控设备，确保设备供电正常。\n2. 若5分钟后仍未恢复上线状态，请前往设备管理，删除该设备后，再重新添加。"
  })
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
