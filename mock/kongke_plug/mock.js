import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'on', //开关
    'control':'stop',
    'mode':'nomal',
    'operation_mode':'end',//洗涤状态
    'remain_washtime':'121',
    'countdownOpen':'60',//延时时间
    'remove_time':'false',//删除延时 (找不到这个,自己假设的)
    'return_standby':'off',
    'closeTime':123, //关机时间
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
  // if (attr.countdownOpen) {
  //   if (attr.countdownOpen>0) {
  //     res.countdownOpen=attr.time.countdownOpen
  //   }else{
  //     res.countdownOpen=0
  //   }
  // }
  // if (attr.closeTime) {
  //   if (attr.closeTime>0) {
  //     res.closeTime=attr.closeTime
  //   }else{
  //     res.closeTime=0
  //   }
  // }
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