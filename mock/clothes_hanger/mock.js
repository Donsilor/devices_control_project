/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
  light: 'on',
  drying: 'on',
  air_drying: 'off',
  sterilization: 'on',
  status: 'bottom',
  timeleft: 30,
  drying_remain: 120,
  air_drying_remain: 120,
  sterilization_remain: 20
}

export function generateSnapShot() {
  return Mock.mock({
    method: 'dr_report_dev_status',
    code: 0,
    result: {
      device_name: '智能晾衣架',
      attribute: res
    }
  })
}

export function set(data) {
  var attr = data.params.attribute
  if (res.drying == 'on' && attr.air_drying == 'on') {
    res.drying = 'off'
  }
  if (res.air_drying == 'on' && attr.drying == 'on') {
    res.air_drying = 'off'
  }
  if (attr.control) {
    res.status = attr.control
  }
  res = Object.assign({}, res, attr)
  return Mock.mock({
    code: 0
  })
}
