import Mock from 'mockjs';

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        result: {
            device_uuid: window.device_uuid,
            timestamp: +new Date(),
            attr: {
                'temperature|1000-5000': 1,
                'humidity|1000-10000': 1
            }
        }
    })
}