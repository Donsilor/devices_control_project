/**
 *
 * @summary mock data
 * @author songwh
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-08-15 11:15:59
 */
import Mock from 'mockjs'

window.device_name = '冰箱'
window.device_category_id = 1

let res = {
  temperature_container: 60,
  temperature_freezer: -200,
  tempVarTempChamber: 20,
  level_freezer: -200,
  level_container: 60,
  mode: 'cool',
  holiday: false,
  intelligent: false,
  fast_frozen: false,
  fast_cool: false,
  queryMode: 'low',
  connectivity: 'online'
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
          "device_name": "冰箱",
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
      if(attr.intelligent == true) {
        attr.holiday = false
      }
      if(attr.holiday == true) {
        attr.level_container = 170
        attr.intelligent = false
      }
      if(attr.fast_frozen == true) {
        attr.holiday = false
        attr.intelligent = false
      }
      if(attr.fast_cool == true) {
        attr.holiday = false
        attr.intelligent = false
      }
    } catch (error) {
      attr = data.content.params.attribute
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
