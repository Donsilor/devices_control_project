/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

window.device_name = '柜式空调'
window.device_category_id = 1
var res = {
    device_uuid: '0000d01ea101000000003876ca400578',
    user_id: 1012,
    device_id: 62082850489720,
    family_id: 1013,
    room_id: 1,
    device_category_id: 1,
    created_at: 1516349498,
    updated_at: 1516349498,
    device_name: '挂式空调',
    default_device_name: '挂式空调',
    attribute: {
        switchStatus: 'on',
        temperature: 260,
        env_temperature: 240,
        mode: 'cold',
        speed: 'low',
        wind_up_down: 'off',
        wind_left_right: 'off',
        sleep_mode: 'on',
        deviceModel: 'KFRd-26GW/FE22BpA',
        manufactureId: 'tcl',
        deviceCategory: 'airconditioner.new',
        deviceSubCategory: 0,
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
    console.log('---------set-------')
    console.log(data)
    try {
      var attr = data.params.attribute
    } catch (error) {
      attr = data.content.params.attribute
    }
    if (attr.switch) {
      res.attribute.switchStatus = attr.switch
    } else if (attr.temperature) {
      res.attribute.temperature = attr.temperature
    } else {
      res.attribute = Object.assign({}, res.attribute, attr)
    }
    if(attr.mode == 'cold') {
      res.attribute.temperature = 260
    }
    if(attr.mode == 'heat') {
      res.attribute.temperature = 230
    }
    return Mock.mock({
        code: 0
    })
}
