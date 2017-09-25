/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    "device_uuid": "4c52ed0b006f0d0001",
    "attr": {
        "device_name": '挂式空调',
        "switchStatus": 'on',
        "temperature": 16,
        "mode": "cold",
        "speed": "low",
        "wind_up_down": "off",
        "wind_left_right": "on",
        "manufactureId": "haier",
        "deviceCategory": "kfr_50lw",
        "deviceSubCategory": 1,
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
        code: 200,
        result: res
        // result: null
    })

}

export function set(data){
    let attr = JSON.parse(data.data).params.attr;
    for(var p in attr){
        res.attr[p] = attr[p];
    }
    return Mock.mock({
        code: 200
        // code: 204,
        // msg: 'test'
    })
}

