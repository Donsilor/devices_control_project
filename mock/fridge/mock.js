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
  tempContainer: 60,
  tempFreezer: -200,
  tempVarTempChamber: 20,
  mode: 'cool',
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
    } catch (error) {
      attr = data.content.params.attribute
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
