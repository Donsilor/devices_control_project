/**
 *
 * @summary mock data
 * @author songwh
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-08-15 11:15:59
 */
import Mock from 'mockjs'

window.device_name = '箭牌智能马桶'
window.device_category_id = 1

let res = {
  temperature_container: 6,
  temperature_freezer: -20,
  tempVarTempChamber: 2,
  level_freezer: -20,
  level_container: 6,
  mode: 'cool',
  holiday: 'off',
  intelligent: 'off',
  fast_frozen: 'off',
  fast_cool: 'off',
  queryMode: 'low',
  connectivity: 'online'
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
          "device_name": "箭牌智能马桶",
          "device_uuid": '112233123',
          "device_access_type": 1,
          "attribute": res
        }
    })
}

export function set(data) {
    try {
      var attr = data.params.attribute
      if(attr.level_container) {
        attr.temperature_container = attr.level_container
      }
      if(attr.level_freezer) {
        attr.temperature_freezer = attr.level_freezer
      }
      if(attr.intelligent == 'on') {
        attr.holiday = 'off'
        attr.fast_frozen = 'off'
        attr.fast_cool = 'off'
      }
      if(attr.holiday == 'on') {
        attr.intelligent = 'off'
        attr.fast_cool = 'off'
      }
      if(attr.fast_frozen == 'on') {
        attr.intelligent = 'off'
      }
      if(attr.fast_cool == 'on') {
        attr.holiday = 'off'
        attr.intelligent = 'off'
      }
    } catch (error) {
      attr = data.content.params.attribute
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
