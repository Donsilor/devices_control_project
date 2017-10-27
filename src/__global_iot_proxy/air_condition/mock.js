/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

window.device_name = '柜式空调';
window.device_category_id = 1;
let res = {
    "device_uuid": "4c52ed0b006f0d0001",
    "attribute": {
        // "device_name": '挂式空调',
        "switchStatus": 'on',
        "temperature": 16,
        "mode": "cold",
        "speed": "low",
        "wind_up_down": "off",
        "wind_left_right": "on",
        // "manufactureId": "haier",
        // "deviceCategory": "kfr_50lw",
        // "deviceSubCategory": 1,
        "timer": [
            {
                "type": "air_switch_on",
                "status": 1,
                "time": "18:30",
                "periodic": 1
            },
            {
                "type": "air_switch_off",
                "status": 0,
                "time": "",
                "periodic": 1
            }
        ]
    }
};

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        code: 0,
        result: res
        // result: null
    })

}

export function set(data){
    let attr = data.params.attr;
    for(var p in attr){
        //res.attr[p] = attr[p];
    }
    return Mock.mock({
        code: 0
        // code: 204,
        // msg: 'test'
    })
}

