/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    'switch': 'on',
    'mode': 'mop',
    'battery_percentage': '100',
    'status': 'working',
    'sweep_direction': 'right',
    'fan_status': 'normall',

    'command': 'stop',
    'frequency': '2',

    'water_level': 'low',
    'remaining': '10',
    'order_time': '01:20',

    'notclean': [],
    'working_time': '60',
    'begin_point': '0',
    'cleaning': '0',
    'cleaned': '0',
    'unclean': '0',

    'alarm_cancel': 'on',
    'wheel_overload': 'on',
    'cliff': 'on',
    'bump': 'on',
    'brush': 'on',
    'dust_box': 'on',
    'battery_overheat': 'on',
    'fan_err': 'on',
    

    'connectivity': 'online'
  }

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            'device_name': '扫地机器人',
            'attribute': res
        }
    })
}

export function set(data){
    var attr = data.params.attribute
    // if(attr.control){
    //     attr.control_status = attr.control
    // }
    // if(attr.negative_ion_switch){
    //     attr.negative_ion_switch = attr.negative_ion_switch
    // }
    // if(attr.mode){
    //   if(attr.mode == 'recharge'){
    //     attr.status = 'charging'
    //   }
    // }
    if(attr.mode){
      if(attr.mode == 'plan_clean'|| attr.mode =='single_plan'||attr.mode == 'edge_clean'){
        attr.status = 'working'
      }
    }
    if(attr.command){
      if(attr.command == 'start'){
        attr.status = 'working'
      } else {
        attr.status = 'standby'
      }
    }
    if(attr.switch){
      attr.switch = attr.switch
      if(attr.switch == 'on'){
        attr.status = 'working'
      }else{
        attr.status = 'standby'
      }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

