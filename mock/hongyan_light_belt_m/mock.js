/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "temperature": 6000,
    "hue": 100,
    "saturation": 254,
    "r": 255,
    "g": 255,
    "b": 255,
    "switch_status": "on",
    "level": 90,
    "connectivity": "online"
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "灯带",
            "attribute": res
        }
    })

}

export function set(data){
    var attr = data.params.attribute
    if(attr.switch){
      if(attr.switch == 'on'){
        res.switch_status = 'on'
      } else {
        res.switch_status = 'off'
      }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

