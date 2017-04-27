<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdSmart.Device.getDeviceMonthHistory
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为HdIot.Device.getDeviceMonthHistory
HdSmart.Device.getDeviceLog(new Date('2017-4'),function(data){
    this.messages.push('成功=>' + JSON.stringify(data));
}, function(error){
    this.messages.push('失败=>' + JSON.stringify(error));
})
            </pre>
            <div v-for="msg in messages">
                {{msg}}
            </div>
        </div>
        <div class="panel-footer">
            <button class="btn btn-default" @click="onClick">点击按钮</button>
        </div>

    </div>
</template>
<script>
    export default {
        name: "getSnapShot",
        data (){
            return {
                page_number: 1,
                messages: ["等待点击 ..."]
            }
        },
        methods: {
            onClick (){
                var _this = this;
                HdSmart.Device.getDeviceMonthHistory(new Date('2017-4'), function (data) {
                    _this.page_number = _this.page_number + 1;
                    _this.messages.push('成功=>' + JSON.stringify(data));
                }, function (error) {
                    _this.messages.push('失败=>' + JSON.stringify(error));
                })
            }
        }
    }
</script>