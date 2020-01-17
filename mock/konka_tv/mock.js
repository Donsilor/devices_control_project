/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

window.device_name = '康佳电视'
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
    device_name: '康佳电视',
    default_device_name: '康佳电视',
    attribute: {
        switch: "on",
        connectivity: 'offline',
        voice:"increase",//decrease/mute 音量：增大/减小/静音
        mute:"false",//是否为静音状态
        point_move:"up",//down/left/right  上/下/左/右
        button:"home"//back/confirm  主页/返回/确认
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
    return Mock.mock({
        code: 0
    })
}
