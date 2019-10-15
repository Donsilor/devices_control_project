import Mock from 'mockjs'

export function generateSnapShot() {
    return Mock.mock({
        method: 'dr_report_dev_status',
        code: 0,
        result: {
            attribute: {
                'open_percentage|1-100': 1,
            }
        }
    })
}
