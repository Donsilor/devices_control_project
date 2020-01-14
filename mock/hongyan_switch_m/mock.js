/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "switch_chan": "off",
    "switch_chan0": "off",
    "switch_chan1": "on",
    "switch_chan2": "off",
    "switch_chan3": "off",
    "chan_num": 4,
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
      },
      {
        "chan_index": 3,
        "chan_status": "off",
        "chan_name": "",
        "chan_avatar": "123dfafga "
      }
    ],
    "connectivity": "offline"
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "智能开关",
            "device_uuid":3434,
            "attribute": res
        }
    })

}
export function generateNetwork() {
  return Mock.mock(-2)
}
export function generateViewHelp() {
  return Mock.mock({
    "content":"请依次尝试以下操作：\n1. 请检查开关电源指示灯是否开启，或是否能通过物理按键直接操控设备，确保设备供电正常。\n2. 若5分钟后仍未恢复上线状态，请前往设备管理，删除该设备后，再重新添加。"
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
    if(attr.switch_chan3){
      if(attr.switch_chan3 == 'on'){
        res.list[3].chan_status = 'on'
      } else {
        res.list[3].chan_status = 'off'
      }
    }
    if(attr.switch_chan){
      if(attr.switch_chan == 'on'){
        res.list[0].chan_status = 'on'
        res.list[1].chan_status = 'on'
        res.list[2].chan_status = 'on'
        res.list[3].chan_status = 'on'
      } else {
        res.list[0].chan_status = 'off'
        res.list[1].chan_status = 'off'
        res.list[2].chan_status = 'off'
        res.list[3].chan_status = 'off'
      }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

