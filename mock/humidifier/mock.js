/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

window.device_name = '加湿器'
window.device_category_id = 1
let res = {
    device_uuid: '0000d01ea101000000003876ca400578',
    user_id: 1012,
    device_id: 62082850489720,
    family_id: 1013,
    room_id: 1,
    device_category_id: 1,
    created_at: 1516349498,
    updated_at: 1516349498,
    device_name: '加湿器',
    default_device_name: '加湿器',
    attribute: {
      switchStatus: "on",
      constant_humidity: "on",
      status_fog: "2",
      current_humidity: "60",
      heat_switch: "on",
      target_humidity: "90",
      water_status: "on",
      uv: "on",
      light_switch: "on",
      error_code: "normal",
      alarm_cancel: "on",
      no_atomizing_head: "on",
      cover_not_closed: "on",
      connectivity: 'online'
    }
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: res
        // result: null
    })
}

export function set(data) {
    var attr = data.params.attribute
    if (attr.switch) {
        res.attribute.switchStatus = attr.switch
    } else {
        res.attribute = Object.assign({}, res.attribute, attr)
    }
    return Mock.mock({
        code: 0
    })
}
