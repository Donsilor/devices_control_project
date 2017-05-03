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

export function generateDeviceLog() {
    let mockOptions = {
        "method": "report",
        "result": {
            "device_uuid": window.device_uuid
        }
    };
    return Mock.mock(mockOptions);
}