/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';

let res = {
    mode: 'cake', //模式
    temperature: 90, //温度
    bake_duration: 0, //时长
    switch: 'off',
    status: 'stop',
    reserve_bake: 1,
    convection: 'on',
    rotisserie: 'on',
    remaining: 88
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

