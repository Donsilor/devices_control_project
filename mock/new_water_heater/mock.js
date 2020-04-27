
import Mock from 'mockjs'

var res = {
  // 万家乐热水器属性
  "reserve": 880,
  // "mode": "dy_expansion",
  "set_temperature": 50,
  "switch": "on",
  "fault": "normal",
  "work_status": "heat",
  "temperature": 37,
  "deviceModel": "LPB100",
  "manufactureId": "Whirlpool",
  "deviceCategory": "water_heater.sn",
  "deviceSubCategory": 0,
  "connectivity": "online",
  "currenttemperature":90,
  "error":"",
  // 万和热水器属性
  "setWTemp": 55, //预设温度
  "outWTemp": 37, //当前温度
  "mode": "kitchen", //模式
  "childLock": "on", //童锁
  "antiFreeze": "on", //智能防冻
  "curGas": "20", //实时用气
  "totalGas": "664.9", //累计用气
  "curAff": "75", //实时用水
  "totalWater": "4442.2", //累计用水
  "heatState": "off", //加热状态
  "waterState": 'on' //出水状态
}
export function generateSnapShot() {
  return Mock.mock({
    method: 'dr_report_dev_status',
    code: 0,
    result: {
      "device_name": "热水器",
      "attribute": res
    }
  })

}

export function set(data) {
  var attr = data.params.attribute
  res = Object.assign({}, res, attr)

  if (attr.mode == 'max_volume') {
    res.set_temperature = 75
  }

  return Mock.mock({
    code: 0
  })
}

