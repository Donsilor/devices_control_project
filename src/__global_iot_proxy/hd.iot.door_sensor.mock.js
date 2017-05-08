import Mock from 'mockjs';
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

export function generateDeviceLogData(time, page_size, direction) {
    page_size = 0;
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


let Random = Mock.Random;
Random.extend({
    PickDates: function () {
        let dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        return this.pick(dates);
    }
})
export function generateDeviceMonthHistoryData() {

    let data = Mock.mock({
        "method": "report",
        "result": {
            "device_uuid": window.device_uuid,
            "has_log|1-30": ['@PickDates']
        }
    })
    return data;
}

export function generateDeviceChangeData(up_time) {
    return Mock.mock({
        'method': 'report',
        'result': {
            'attr': {
                'status|1': ['on', 'off']
            }
        }
    })
}