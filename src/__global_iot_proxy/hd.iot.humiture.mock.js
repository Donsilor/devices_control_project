import Mock from 'mockjs';

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        result: {
            device_uuid: window.device_uuid,
            timestamp: +new Date(),
            attr: {
                'temperature|-2000-6000': 1,
                'humidity|0-10000': 1
            }
        }
    })
}
export function generateDeviceLogByDay(time) {
    time = time - 23 * 60 * 60 * 1000;
    let mockOptions = {
        "method": "report",
        "result": {
            "device_uuid": window.device_uuid,
            "log|24": [{
                "time|+3600000": time,
                "num|+1": 0,
                attr: {
                    "temperature|-2000-6000": 1,
                    "humidity|0-10000": 1
                }
            }]
        }
    };
    return Mock.mock(mockOptions);
}
