/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "connectivity": "online"
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "中控面板",
            "device_uuid":3434,
            "attribute": res
        }
    })

}
export function generateNetwork() {
  return Mock.mock(-2)
}
export function generateViewHelp() {
  return Mock.mock({
    "content":"请依次尝试以下操作：\n1. 请检查开关电源指示灯是否开启，或是否能通过物理按键直接操控设备，确保设备供电正常。\n2. 若5分钟后仍未恢复上线状态，请前往设备管理，删除该设备后，再重新添加。",
    "router_content":"请依次尝试以下操作：\n1. 请检查开关电源指示灯是否开启，或是否能通过物理按键直接操控设备，确保设备供电正常。\n2. 若5分钟后仍未恢复上线状态，请前往设备管理，删除该设备后，再重新添加。"
  })
}

export function set(data){
    var attr = data.params.attribute
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

