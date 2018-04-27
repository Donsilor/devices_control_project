/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    "device_uuid": "0000d01ea101000000003876ca400578",
    "user_id": 1012,
    "device_id": 62082850489720,
    "family_id": 1013,
    "room_id": 1,
    "device_category_id": 1,
    "created_at": 1516349498,
    "updated_at": 1516349498,
    "device_name": "智能门锁",
    "default_device_name": "智能门锁",
    "attribute": {
      "switch": "off",
      "battery_percentage":10
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

export function set(data){
    var attr = data.params.attribute
    if(attr.switch){
        res.attribute.switch = 'on';
    }else if(attr.temperature){
        res.attribute.temperature = 230
    }else{
        res.attribute = Object.assign({}, res.attribute, attr)
    }
    return Mock.mock({
        code: 0
    })
}

