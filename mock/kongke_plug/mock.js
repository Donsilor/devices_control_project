import Mock from 'mockjs'

let res = {
    "connectivity": "online", //l
    "switch": 'open', //开关
    'openTime': 0,//预约开机时间
    'countdownOpen':'0',//延时开机时间
    'countdownClose':'0',//延时关机时间

    'remove_time':'false',//删除延时 (找不到这个,自己假设的)
    'closeTime':0, //预约关机时间
    'ovp':'open',//充电保护 open/close
    'openEnable': 'false',
    'closeEnable': 'false',
    'delayClose': {
      'closeEnable':'y',
      'closeTime':'2019-11-21-23:37:44',
      'openEnable':'n',
      'openTime':'2019-11-19-17:37:44',
      'respeat':'1',
      'setTime':'2019-11-19-17:32:44',
      'timerEnable':'y',
      'timerld':'1023'
    },
    'delayOpen': {},
    'timer': {
      'closeTime': '2019-11-20-14:20:20',
      'openTime': '2019-11-20-18:40:50',
    }
}
export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "控客插座",
            "attribute": res
        }
    })
}

export function set(data) {
  try {
    var attr = data.params.attribute
  } catch (error) {
    attr = data.content.params.attribute
  }
  console.log(attr)
  if(attr.switch == 'open') {
    res.closeEnable = 'false'
  } else {
    res.openEnable = 'false'
  }
  if (attr.remove_time_task) {
    if (attr.remove_time_task.timerId>=1) {
      res.closeTime=0
    }else{
      res.closeTime=0
    }
  }
  // if (attr.closeTime) {
  //   if (attr.closeTime>0) {
  //     res.closeTime=attr.closeTime
  //   }else{
  //     res.closeTime=0
  //   }
  // }
  if (attr.switch) {
    res.switch = attr.switch
  } else if (attr.temperature) {
    res.temperature = attr.temperature
  } else {
    res = Object.assign({}, res, attr)
  }
  return Mock.mock({
      code: 0
  })
}
