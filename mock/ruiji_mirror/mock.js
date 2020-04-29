/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs'

let res = {
    "connectivity": "online"
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "中控面板",
            "device_uuid":3434,
            "attribute": res
        }
    })

}
export function getRuijiData() {
    return Mock.mock({list:[{
        attribute: {
          createTime: "2020-04-26 17:02:00",
          value1: "150",
          value10: "0.0",
          value11: "16.3",
          value2: "85",
          value3: "100",
          value4: "0.0",
          value5: "0.0",
          value6: 0,
          value7: "0.0",
          value8: "0.0",
          value9: "0.0",
        },
        "device_id": 8087252,
        "family_id": 27225,
        "status_modified_at": 1587892191082,
        type: "395318.bmi",
        "updated_at": 1587892191,
      },
        {
          attribute: {
            createTime: "2020-04-26 17:02:00",
            value1: "110",
            value10: "0.0",
            value11: "17.3",
            value2: "88",
            value3: "99",
            value4: "0.0",
            value5: "0.0",
            value6: 0,
            value7: "0.0",
            value8: "0.0",
            value9: "0.0",
          },
          "device_id": 8087252,
          "family_id": 27225,
          "status_modified_at": 1587891986852,
          type: "317888.bmi",
          "updated_at": 1587891986,
        },{
          attribute: {
            createTime: "2020-04-26 17:02:00",
            value1: "110",
            value10: "0.0",
            value11: "17.3",
            value2: "88",
            value3: "99",
            value4: "0.0",
            value5: "0.0",
            value6: 0,
            value7: "0.0",
            value8: "0.0",
            value9: "0.0",
          },
          "device_id": 8087252,
          "family_id": 27225,
          "status_modified_at": 1587891986852,
          type: "317888.bmi",
          "updated_at": 1587891986,
        },{
          attribute: {
            createTime: "2020-04-26 17:02:00",
            value1: "110",
            value10: "0.0",
            value11: "17.3",
            value2: "88",
            value3: "100",
            value4: "0.0",
            value5: "0.0",
            value6: 0,
            value7: "0.0",
            value8: "0.0",
            value9: "0.0",
          },
          "device_id": 8087252,
          "family_id": 27225,
          "status_modified_at": 1587891986852,
          type: "317888.bmi",
          "updated_at": 1587891986,
        },{
          attribute: {
            createTime: "2019-04-26 17:02:00",
            value1: "110",
            value10: "0.0",
            value11: "17.3",
            value2: "78",
            value3: "110",
            value4: "0.0",
            value5: "0.0",
            value6: 0,
            value7: "0.0",
            value8: "0.0",
            value9: "0.0",
          },
          "device_id": 8087252,
          "family_id": 27225,
          "status_modified_at": 1587891986852,
          type: "317888.bmi",
          "updated_at": 1587891986,
        },{
          attribute: {
            createTime: "2019-04-26 17:02:00",
            value1: "110",
            value10: "0.0",
            value11: "17.3",
            value2: "80",
            value3: "125",
            value4: "0.0",
            value5: "0.0",
            value6: 0,
            value7: "0.0",
            value8: "0.0",
            value9: "0.0",
          },
          "device_id": 8087252,
          "family_id": 27225,
          "status_modified_at": 1587891986852,
          type: "317888.bmi",
          "updated_at": 1587891986,
        }
      ]})

}
export function generateNetwork() {
  return Mock.mock(0)
}
export function generateViewHelp() {
  return Mock.mock({
    "content":"请依次尝试以下操作：\n1. 请检查开关电源指示灯是否开启，或是否能通过物理按键直接操控设备，确保设备供电正常。\n2. 若5分钟后仍未恢复上线状态，请前往设备管理，删除该设备后，再重新添加。",
    "router_content":"请依次尝试以下操作：\n1. 请检查开关电源指示灯是否开启，或是否能通过物理按键直接操控设备，确保设备供电正常。\n2. 若5分钟后仍未恢复上线状态，请前往设备管理，删除该设备后，再重新添加。"
  })
}

export function set(data){
    var attr = data.params.attribute
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

