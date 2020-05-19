/**
 * Created by lenovo on 2017/7/10.
 */
import Mock from 'mockjs';
let res = {
    "data":{
        "aqi": {
            "cityName": "北京市",
            "co": "11",
            "coC": "1.1",
            "no2": "19",
            "no2C": "37.0",
            "o3": "23",
            "o3C": "72.0",
            "pm10": "98",
            "pm10C": "146.0",
            "pm25": "80",
            "pm25C": "59.0",
            "pubtime": "1520244000000",
            "rank": "560\/581",
            "so2": "6",
            "so2C": "17.0",
            "value": "98"
        },
        "forecast": [{
            "conditionDay": "多云",
            "conditionIdDay": "1",
            "conditionIdNight": "30",
            "conditionNight": "晴",
            "predictDate": "2018-03-05",
            "tempDay": "8",
            "tempNight": "-4",
            "updatetime": "2018-03-05 18:10:07",
            "windDirDay": "南风",
            "windDirNight": "东南风",
            "windLevelDay": "3",
            "windLevelNight": "3"
        }, {
            "conditionDay": "多云",
            "conditionIdDay": "1",
            "conditionIdNight": "2",
            "conditionNight": "阴",
            "predictDate": "2018-03-06",
            "tempDay": "6",
            "tempNight": "-3",
            "updatetime": "2018-03-05 18:10:07",
            "windDirDay": "东南风",
            "windDirNight": "东南风",
            "windLevelDay": "3-4",
            "windLevelNight": "3"
        }, {
            "conditionDay": "阴",
            "conditionIdDay": "2",
            "conditionIdNight": "31",
            "conditionNight": "多云",
            "predictDate": "2018-03-07",
            "tempDay": "6",
            "tempNight": "-2",
            "updatetime": "2018-03-05 18:10:07",
            "windDirDay": "西南风",
            "windDirNight": "北风",
            "windLevelDay": "3",
            "windLevelNight": "3"
        }, {
            "conditionDay": "晴",
            "conditionIdDay": "0",
            "conditionIdNight": "30",
            "conditionNight": "晴",
            "predictDate": "2018-03-08",
            "tempDay": "8",
            "tempNight": "-3",
            "updatetime": "2018-03-05 18:10:07",
            "windDirDay": "南风",
            "windDirNight": "南风",
            "windLevelDay": "3",
            "windLevelNight": "3"
        }, {
            "conditionDay": "多云",
            "conditionIdDay": "1",
            "conditionIdNight": "31",
            "conditionNight": "多云",
            "predictDate": "2018-03-09",
            "tempDay": "10",
            "tempNight": "-2",
            "updatetime": "2018-03-05 18:10:07",
            "windDirDay": "南风",
            "windDirNight": "东北风",
            "windLevelDay": "3",
            "windLevelNight": "3"
        }, {
            "conditionDay": "晴",
            "conditionIdDay": "0",
            "conditionIdNight": "30",
            "conditionNight": "晴",
            "predictDate": "2018-03-10",
            "tempDay": "11",
            "tempNight": "-2",
            "updatetime": "2018-03-05 18:10:07",
            "windDirDay": "东南风",
            "windDirNight": "东南风",
            "windLevelDay": "3",
            "windLevelNight": "3"
        }
        ],
        "condition": {
            "condition": "多云",
            "humidity": "27",
            "icon": "1",
            "temp": "9",
            "updatetime": "2018-03-16 15:20:00",
            "windDir": "西南风",
            "windLevel": "4"
        }
    }

}

export function generateSnapShot() {
    return Mock.mock({
        method: 'weather',
        code: 0,
        result: res
    })

}


