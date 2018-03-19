/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';
const getWenduList = (begin,end) => {
    let arr = []
    for (let i = begin; i<=end; i += 5) {
        arr.push({name: i, value: i, active: false})
    }
    return arr
}
const getTimeList = (begin,end) => {
    let arr = []
    for (let i = begin; i<=end; i++ ) {
        arr.push({name: i, value: i, active: false})
    }
    return arr
}

let res = {
    switch: 'off',
    status: 'stop',
    reserve_bake: 1,
    remaining: 88,
    step: 'reserve',
    mode: 'barbecues', //模式
    temperature: 220, //温度
    bake_duration: 30, //时长
    convection: 'off',
    rotisserie: 'off',
    fire: '上下火',
    wenduList: getWenduList(100,230),
    timeList: getTimeList(1,60)
}

export function generateSnapShot() {
    return Mock.mock({
        method: 'report',
        code: 0,
        result: {
            "device_name": "烤箱",
            "attribute": res
        }
    })

}

export function set(data){
    var attr = data.params.attribute
    if(attr.control){
        attr.status = attr.control
        if(attr.status == 'start'){
            attr.status = 'run'
        }
    }
    res = Object.assign({}, res, attr)
    return Mock.mock({
        code: 0
    })
}

