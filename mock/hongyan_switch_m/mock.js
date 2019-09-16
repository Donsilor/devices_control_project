/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "switch_chan0": "off",
    "switch_chan1": "on",
    "switch_chan2": "off",
    "chan_num": 3,
    "chan0_name": "卧室筒灯",
    "chan1_name": "客厅筒灯",
    "chan2_name": "厨房筒灯",
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
    // if(attr.control){
    //     if(attr.control == 'start'){
    //         attr.status = 'start'
    //     } else if(attr.control == 'stop') {
    //       attr.status = 'stop'
    //     }
    // }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

