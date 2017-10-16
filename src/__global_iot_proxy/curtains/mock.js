import Mock from 'mockjs';

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        result: {
            attribute: {
                'open_percentage|1-100': 1,
            }
        }
    })
}
