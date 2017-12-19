import Mock from 'mockjs';

//{"method":"report","result":{"timestamp":1493367110,"device_uuid":"c04fcb0b006f0d0001","attr":{"status":"on","alarm_low_battery":"off","alarm_removal":"on"}}}
export function generateSnapShotData() {
    return Mock.mock({
        "method": "report",
        "result": {
            "timestamp": 1493367110,
            "device_uuid": window.device_uuid,
            "attr": {
                "status|1": ["on", "off"],
                "alarm_low_battery|1": ["on", "off"],
                "alarm_removal|1": ["on", "off"]
            }
        }
    })
}

// {
//     "method": "report",
//     "result": {
//     "device_uuid": "c04fcb0b006f0d0001",
//         "log": [{
//         "time": 1493318989,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318971,
//         "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318969,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318967,
//         "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318965,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318934,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318932,
//         "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318731,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318730,
//         "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318696,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318690,
//         "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318688,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493318686,
//         "attr": {"status": "off", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493167232,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }, {
//         "time": 1493167229,
//         "attr": {"status": "on", "alarm_low_battery": "off", "alarm_removal": "on"}
//     }]
// }
// }

export function generateDeviceLogData(time, page_size, direction) {
    let mockOptions = {
        "method": "report",
        "result": {
            "device_uuid": window.device_uuid
        }
    };
    if (direction == 'down') {
        mockOptions.result[`log|${page_size}`] = [{
            [`time|${time - page_size * 60000}-${time}`]: 1,
            "attr": {
                "status|1": ["on", "off"],
                "alarm_low_battery|1": ["on", "off"],
                "alarm_removal|1": ["on", "off"]
            }
        }];
    } else if (direction == 'up') {
        mockOptions.result[`log|${page_size}`] = [{
            [`time|${time}-${time + page_size * 60000}`]: 1,
            "attr": {
                "status|1": ["on", "off"],
                "alarm_low_battery|1": ["on", "off"],
                "alarm_removal|1": ["on", "off"]
            }
        }];
    }
    return Mock.mock(mockOptions);
}


//{"method": "report","result": {"device_uuid": "112233445566778810", "has_log": [1,2,10,21 ]}}

let Random = Mock.Random;
Random.extend({
    PickDates: function () {
        let dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        return this.pick(dates);
        // return [this.pick(dates),this.pick(dates),this.pick(dates)];
    }
})
export function generateDeviceMonthHistoryData() {

    let data =  Mock.mock({
        "method": "report",
        "result": {
            "device_uuid": window.device_uuid,
            "has_log|1-30":['@PickDates']
        }
    })
    return data;
}