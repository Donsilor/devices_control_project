/**
 *
 * @summary mock data
 * @author songwh
 *
 * Created at     : 2019-08-05 11:32:49
 * Last modified  : 2019-08-09 15:05:29
 */
import Mock from 'mockjs'

window.device_name = '冰箱'
window.device_category_id = 1
var res = {
  tempContainer: 160,
  tempFreezer: 240,
  TempVarTempChamber: 240,
  mode: 'cold',
  queryMode: 'low',
  connectivity: 'online'
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: res
        // result: null
    })
}

export function set(data) {
    try {
      var attr = data.params.attribute
    } catch (error) {
      attr = data.content.params.attribute
    }
    res.attribute = Object.assign({}, res.attribute, attr)
    return Mock.mock({
        code: 0
    })
}
