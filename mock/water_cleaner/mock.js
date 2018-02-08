
import Mock from 'mockjs';

var res = {
    "water_filter_result": {
        "TDS": [500,100]
    },
    "status": "clean",
    "filter_time_total": [1000, 1000, 1000, 1000, 1000],
    "filter_time_remaining": [300, 500, 0, 600, 0]
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        code: 0,
        result: {
            "device_name": "智能净水器",
            "attribute": res
        }
    })

}

export function set(data){
    var attr = data.params.attribute
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

