import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'on', //开关
    'control':'stop',
    'mode':'nomal',
    'operation_mode':'end',//洗涤状态
    'remain_washtime':'121',
    'return_standby':'off',
    'timer_value':123, //关机时间
    'ovp':'open',//充电保护 open/close
    'mode_status':'off'//程序是否运行
}
export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "厨房的洗碗机",
            "attribute": res
        }
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
  if (attr.time) {
    if (attr.time.timer_value>0) {
      console.log('aaaaaaaaaaaaaa',attr.time.timer_value)
      res.timer_value=attr.time.timer_value
    }else{
      res.timer_value=0
    }
    if (attr.time.timer_switch=='on') {
      res.timer_switch=attr.time.timer_switch
    }else{
      res.timer_switch='off'
    }
  }
  if (attr.switch) {
    res.switchStatus = attr.switch
  } else if (attr.temperature) {
    res.temperature = attr.temperature
  } else {
    res = Object.assign({}, res, attr)
  }
  return Mock.mock({
      code: 0
  })
}