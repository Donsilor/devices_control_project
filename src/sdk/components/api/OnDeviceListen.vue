<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdSmart.onDeviceListen
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为window.onDeviceChange
HdSmart.onDeviceListen(function(data){
    this.messages.push("1st listen : "+data);
});
HdSmart.onDeviceListen(function(data){
    this.messages.push("2nd listen : "+data);
});
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
        name: "ready",
        data (){
            return {
                messages: ["等待点击"]
            }
        },
        mounted (){
            HdSmart.onDeviceListen((data) => {
                data  = JSON.stringify(data);
                this.messages.push(`1st listen : ${data}`);
            });
            HdSmart.onDeviceListen((data) => {
                data = JSON.stringify(data);
                this.messages.push(`2nc listen : ${data}`);
            });
        },
        methods: {
            onClick (){
                window.onDeviceChange({
                    attr: {
                        mode: 'off'
                    }
                });
            }
        }
    }
</script>