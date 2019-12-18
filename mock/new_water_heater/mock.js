
import Mock from 'mockjs'

var res = {
  "reserve": 880,
  "mode": "dy_expansion",
  "set_temperature": 50,
  "switch": "on",
  "fault": "normal",
  "work_status": "heat",
  "temperature": 37,
  "deviceModel": "LPB100",
  "manufactureId": "Whirlpool",
  "deviceCategory": "water_heater.sn",
  "deviceSubCategory": 0,
  "connectivity": "offline",
  "currenttemperature":85,
  "error":"running"
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

