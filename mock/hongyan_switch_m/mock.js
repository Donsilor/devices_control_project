/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "switch_chan0": "off",
    "switch_chan1": "on",
    "switch_chan2": "off",
    "chan_num": 3,
    "list": [
      {
        "chan_index": 0,
        "chan_status": "off",
        "chan_name": "卧室筒灯",
        "chan_avatar": "123dfafga "
      },
      {
        "chan_index": 1,
        "chan_status": "off",
        "chan_name": "",
        "chan_avatar": "123dfafga "
      },
      {
        "chan_index": 2,
        "chan_status": "off",
        "chan_name": "",
        "chan_avatar": "123dfafga "
      }
    ],
    "connectivity": "online"
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "智能开关",
            "attribute": res
        }
    })

}

export function set(data){
    var attr = data.params.attribute
    if(attr.switch_chan0){
      if(attr.switch_chan0 == 'on'){
        res.list[0].chan_status = 'on'
      } else {
        res.list[0].chan_status = 'off'
      }
    }
    if(attr.switch_chan1){
      if(attr.switch_chan1 == 'on'){
        res.list[1].chan_status = 'on'
      } else {
        res.list[1].chan_status = 'off'
      }
    }
    if(attr.switch_chan2){
      if(attr.switch_chan2 == 'on'){
        res.list[2].chan_status = 'on'
      } else {
        res.list[2].chan_status = 'off'
      }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

