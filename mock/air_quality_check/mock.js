import Mock from 'mockjs'

let res = {
    "humidity": 0, //湿度，单位为0.01%, 5666就是56.66%
    "temperature": 0, //温度，单位为0.1摄氏度, 188就是18.8摄氏度
    "co2": 1040, //CO2：ppm，大于5000ppm为重度污染
    "tvoc": 150,// TVOC：毫克/立方米(mg/m3)，精度0.1(mg/m3)，25mg/m3以上重度污染
    "pm2.5":30, // PM2.5：微克/立方米(μg/m3)，精度0.1(μg/m3),大于250μg/m³及以上为重试污染
    "envlux":235, // 光照度
    'formaldehyde':200, // 甲醛：微克/立方米(μg/m3)，精度0.1(μg/m3)，800 μg/m3以上重度污染
    'envnoise':30 // 噪音
  }

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            "device_name": "空气云管家",
            "attribute": res
        }
    })
}

export function set(data){
    var attr = data.params.attribute
    // if(attr.order_mode){
    //     attr.machine_status = attr.order_mode
    //     attr.machine_mode = attr.order_mode
    // }
  //   if(attr.machine_mode){
  //     attr.order_mode = attr.machine_mode
  // }
    if(attr.negative_ion_switch){
        attr.negative_ion_switch_status = attr.negative_ion_switch
    }
    if(attr.switch){
        attr.switch_status = attr.switch
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}
