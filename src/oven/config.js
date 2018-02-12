
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
const ALL_MODE = {
    barbecues:{
        mode: 'barbecues', //模式
        temperature: 220, //温度
        bake_duration: 30, //时长
        status: 'start',
        convection: 'off',
        rotisserie: 'off',
        fire: '上下火',
        wenduList: getWenduList(100,230),
        timeList: getTimeList(1,60)
    },
    pizza:{
        mode: 'pizza', //模式
        temperature: 220, //温度
        bake_duration: 20, //时长
        status: 'start',
        convection: 'off',
        rotisserie: 'off',
        fire: '上下火',
        wenduList: getWenduList(150,230),
        timeList: getTimeList(1,30)
    },
    fish_shrimp:{
        mode: 'fish_shrimp', //模式
        temperature: 200, //温度
        bake_duration: 15, //时长
        status: 'start',
        convection: 'off',
        rotisserie: 'off',
        fire: '上下火',
        wenduList: getWenduList(200,230),
        timeList: getTimeList(1,30)
    },
    biscuit:{
        mode: 'biscuit', //模式
        temperature: 160, //温度
        bake_duration: 16, //时长
        status: 'start',
        convection: 'on',
        rotisserie: 'off',
        fire: '上下火',
        wenduList: getWenduList(65,200),
        timeList: getTimeList(1,60)
    },
    bread:{
        mode: 'bread', //模式
        temperature: 230, //温度
        bake_duration: 4, //时长
        // switch: 'off',
        status: 'start',
        // reserve_bake: 1,
        convection: 'off',
        rotisserie: 'off',
        // remaining: 88,
        fire: '上下火',
        wenduList: getWenduList(100,230),
        timeList: getTimeList(2,6)
    },
    cake:{
        mode: 'cake', //模式
        temperature: 180, //温度
        bake_duration: 20, //时长
        status: 'start',
        convection: 'off',
        rotisserie: 'off',
        fire: '上下火',
        wenduList: getWenduList(100,200),
        timeList: getTimeList(1,60)
    },
    sweet_potato:{
        mode: 'sweet_potato', //模式
        temperature: 220, //温度
        bake_duration: 50, //时长
        status: 'start',
        convection: 'on',
        rotisserie: 'off',
        fire: '上下火',
        wenduList: getWenduList(100,230),
        timeList: getTimeList(30,60)
    },
    chicken:{
        mode: 'chicken',
        temperature: 220,
        bake_duration: 50,
        status: 'start',
        convection: 'off',
        rotisserie: 'on',
        fire: '上下火',
        wenduList: getWenduList(65,230),
        timeList: getTimeList(1,60)
    },
    broil:{
        mode: 'broil',
        temperature: 200,
        bake_duration: 20,
        // switch: 'off',
        status: 'start',
        // reserve_bake: 1,
        convection: 'off',
        rotisserie: 'off',
        // remaining: 88,
        fire: '上火',
        wenduList: getWenduList(40,200),
        timeList: getTimeList(1,99)
    },
    bake:{
        mode: 'bake',
        temperature: 100,
        bake_duration: 60,
        // switch: 'off',
        status: 'start',
        // reserve_bake: 1,
        convection: 'off',
        rotisserie: 'on',
        // remaining: 88,
        fire: '下火',
        wenduList: getWenduList(40,200),
        timeList: getTimeList(1,99)
    },
    roast:{
        mode: 'roast',
        temperature: 220,
        bake_duration: 45,
        status: 'start',
        convection: 'off',
        rotisserie: 'on',
        fire: '上下火',
        wenduList: getWenduList(40,230),
        timeList: getTimeList(1,99)
    },
}
export default ALL_MODE
