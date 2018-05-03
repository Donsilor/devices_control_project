/**
 * Created by lenovo on 2017/6/27.
 */
import on from '../app';
import {apiList} from '../app/constant'
import * as mockData from './mock';

if (location.search.indexOf('env=desktop') != -1) {

    window.device_name = '智能门锁'

    on(apiList.device_getsnapshot, function(data, done){
        done(mockData.generateSnapShot())
    })


    var a = {"method":"dm_set","timestamp":1525248100071,"req_id":3158539,"msg":"fail","code":-16005,"result":{"user_id":4039,"family_id":4040,"device_uuid":"0004e8922b020001975e1e0e006f0d00"}}

    on(apiList.device_control, function(data, done){
        done({"code": 0,"msg": "TcpClient send msg success","timestamp":1525248093984,"req_id":3158539,"method":"dm_set"})
        setTimeout(function(){
            a.req_id = data.req_id
            onDeviceChange(a)
        },1000)
    })
}


/*

{"req_id":3158539,"timestamp":1525248093952,"method":"dm_set","params":{"device_uuid":"0004e8922b020001975e1e0e006f0d00","user_id":4039,"family_id":4040,"attribute":{"switch":"on","pwd":"949494949494"}},"nodeid":"doorlock.main.switch"}", source: file:///android_asset/door_lock/js/sdk.ba2a7810b684af411fe1.js (1)
{"code": 0,"msg": "TcpClient send msg success","timestamp":1525248093984,"req_id":3158539,"method":"dm_set"}", source: file:///android_asset/door_lock/js/sdk.ba2a7810b684af411fe1.js (1)
"Uncaught ReferenceError: callback is not defined", source: file:///android_asset/door_lock/js/sdk.ba2a7810b684af411fe1.js (1)
"device change = ", source: file:///android_asset/door_lock/js/sdk.ba2a7810b684af411fe1.js (1)

*/
