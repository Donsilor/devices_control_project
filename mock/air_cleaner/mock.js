/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    "air_filter_result": {
      "air_quality": [
        "very_high"
      ],
      "PM25": [
        0
      ]
    },
    "switch_status": "on",
    "child_lock_switch_status": "off",
    "negative_ion_switch_status": "off",
    "speed": "low",
    "control_status": "manual",
    "filter_time_used": "2114",
    "filter_time_remaining": "46",
    "temperature": "0",
    "humidity": "0",
    "deviceModel": "KJ819F-B2",
    "manufactureId": "tcl",
    "deviceCategory": "air_filter.main",
    "deviceSubCategory": 0,
    "connectivity": "online"
  }

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "空气净化器",
            "attribute": res
        }
    })
}

export function set(data){
    var attr = data.params.attribute
    if(attr.control){
        attr.control_status = attr.control
    }
    if(attr.negative_ion_switch){
        attr.negative_ion_switch_status = attr.negative_ion_switch
    }
    if(attr.switch){
        attr.switch_status = attr.switch
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

