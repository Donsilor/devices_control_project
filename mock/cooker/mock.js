/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "switch": 'off',
    "work_status": 'start',
    "stove_tem": {
      "stove_0": '1',
      "stove_1": '1',
    },
    "prevent_dry": {
      "stove_0": '1',
      "stove_1": '1',
    },
    "ignite_time": {
      "stove_0": '1',
      "stove_1": '1',
    },
    "ignite_status": {
      "stove_0": 'no',
      "stove_1": 'no',
    },
    "fire_status": {
      "stove_0": 'nomal',
      "stove_1": 'no',
    },
    "stove_status": {
      "stove_0": 'true',
      "stove_1": 'true',
    },
    "lampblack_status": 'no',
    "combustible_gas":'no',
    "dry_heat": {
      "stove_0":'off',
      "stove_1":'off',
    },
    "accident_out": {
      "stove_0": 'off',
      "stove_1": 'off',
    },
    "connectivity": "online"
  }

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "灶具",
            "attribute": res
        }
    })
}

export function set(data){
    var attr = data.params.attribute
    // if(attr.order_mode){
    //     attr.machine_status = attr.order_mode
    //     attr.machine_mode = attr.order_mode
    // }
  //   if(attr.machine_mode){
  //     attr.order_mode = attr.machine_mode
  // }
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

