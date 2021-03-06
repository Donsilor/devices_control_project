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
    device_name: '厨房蒸箱',
    default_device_name: '厨房蒸箱',
    attribute: {
        PowerSwitchAll: 2, // 2开机 0关机
        RemainingTime: '9', // 工作剩余时间
        WorkState: '0', // 工作状态
        WorkMode: '0',
        SetTemperature1: 99, // 设定温度值1
        WaterShortage: '0', // '0'不缺水 '1'缺水
        Light: '0',
        temperature: 170,
        env_temperature: 240,
        mode: 'cold',
        order_time:0,
        speed: 'normal',
        wind_up_down: 'off',
        wind_left_right: 'off',
        sleep_mode: 'on',
        deviceModel: 'KFRd-26GW/FE22BpA',
        manufactureId: 'tcl',
        deviceCategory: 'airconditioner.new',
        deviceSubCategory: 0,
        connectivity: 'online',
        timer_switch:'off',
        timer_value:0,
        wind_up:'off',
        wind_down:'off',
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
    if (attr.time) {
      if (attr.time.timer_value>0) {
        res.attribute.timer_value=attr.time.timer_value
      }else{
        res.attribute.timer_value=0
      }
      if (attr.time.timer_switch=='on') {
        res.attribute.timer_switch=attr.time.timer_switch
      }else{
        res.attribute.timer_switch='off'
      }
    }
    if (attr.switch) {
      res.attribute.switchStatus = attr.switch
    } else if (attr.temperature) {
      res.attribute.temperature = attr.temperature
    } else {
      res.attribute = Object.assign({}, res.attribute, attr)
    }
    return Mock.mock({
        code: 0
    })
}
