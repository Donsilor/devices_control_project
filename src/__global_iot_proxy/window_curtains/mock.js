import Mock from 'mockjs';

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        result: {
            attr: {
                'close_percentage|1-100': 1,
            }
        }
    })
}