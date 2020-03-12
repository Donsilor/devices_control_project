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
    room_name: '客厅',
    default_device_name: '挂式空调',
    attribute: {
        switchStatus: "on",
        temperature: 186,
        env_temperature: 200,
        mode: 'cold',
        order_time:0,
        speed: 'normal',
        wind_up_down: 'off',
        wind_left_right: 'off',
        wind_up: 'on',
        wind_down: 'off',
        wind_middle: 'off',
        wind_mid_up: 'off',
        wind_mid_down: 'off',
        wind_auto: 'off',
        strong_wind:'off',//强力
        auxiliary_heating_mode:'on',//电加热
        digital_display:'on',//数显
        sleep_mode: 'on',
        deviceSubCategory: 0,
        connectivity: 'online',
        timer_switch:'on',
        time_value:0,
        close_time:'false',
        // error:'设备故障啦啦啦啦'
    },
    third_attribute:{
      "selection":"16,30;0,1,2,3,4;0,1,2,3",
      "id":"10",
      "tantron_id":"b5dc664042c5edab"
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

export function generateNetwork() {
  return Mock.mock(0)
}

export function set(data) {
    console.log('---------set-------')
    console.log(data)
    try {
      var attr = data.params.attribute
    } catch (error) {
      attr = data.content.params.attribute
    }
    if(attr.wind_up=='on') {
       res.attribute.wind_down = 'off'
       res.attribute.wind_middle = 'off'
       res.attribute.wind_mid_up = 'off'
       res.attribute.wind_mid_down = 'off'
       res.attribute.wind_auto = 'off'
    }
    if (attr.wind_down=='on') {
       res.attribute.wind_up = 'off'
       res.attribute.wind_middle = 'off'
       res.attribute.wind_mid_up = 'off'
       res.attribute.wind_mid_down = 'off'
       res.attribute.wind_auto = 'off'
    }
    if (attr.wind_middle=='on') {
      res.attribute.wind_up = 'off'
      res.attribute.wind_down = 'off'
      res.attribute.wind_mid_up = 'off'
      res.attribute.wind_mid_down = 'off'
      res.attribute.wind_auto = 'off'
   }
   if (attr.wind_mid_up=='on') {
    res.attribute.wind_up = 'off'
    res.attribute.wind_down = 'off'
    res.attribute.wind_middle = 'off'
    res.attribute.wind_mid_down = 'off'
    res.attribute.wind_auto = 'off'
   }
   if (attr.wind_mid_down=='on') {
    res.attribute.wind_up = 'off'
    res.attribute.wind_down = 'off'
    res.attribute.wind_middle = 'off'
    res.attribute.wind_mid_up = 'off'
    res.attribute.wind_auto = 'off'
 }
 if (attr.wind_auto=='on') {
  res.attribute.wind_up = 'off'
  res.attribute.wind_down = 'off'
  res.attribute.wind_middle = 'off'
  res.attribute.wind_mid_up = 'off'
  res.attribute.wind_mid_down = 'off'
}



    if (attr.close_time) {
      if (attr.close_time == 'true') {
          res.attribute.time_value = 0
      }
    }
    if (attr.time) {
      if (attr.time.time_value>0) {
        res.attribute.time_value=attr.time.time_value
      }else{
        res.attribute.time_value=0
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
