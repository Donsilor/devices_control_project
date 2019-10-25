import Mock from 'mockjs'

//{"method":"report","result":{"timestamp":1493367110,"device_uuid":"c04fcb0b006f0d0001","attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}}}
// export function generateSnapShotData() {
//     return Mock.mock({
//         "method": "dr_report_dev_status",
//         "result": {
//           'device_id':111,
//             "timestamp": 1493367110,
//             "device_uuid": window.device_uuid,
//             "attribute": {
//                 "status|1": ["on", "off"],
//                 "alarm_low_battery|1": ["on", "off"],
//                 "alarm_removal|1": ["on", "off"]
//             },
//             "more":1
//         }
//     })
// }
var res = {

  user_id: 1012,
  family_id: 1013,
  room_id: 1,
  device_category_id: 1,
  created_at: 1516349498,
  device_name: '人体传感器',
  default_device_name: '人体传感器',
  more:1,
  list:[{
    device_id: 62082850489720,
    device_uuid: '0000d01ea101000000003876ca400578',
    more:1,
    status:1,
    updated_at:'2018-04-20 10:32:00',
    attribute: {
      "status": 'on',
      "alarm_low_battery": 'on',
      "alarm_removal":'on'
    },

  }]


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
  console.log('---------set-------')
  console.log(data)
  
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
