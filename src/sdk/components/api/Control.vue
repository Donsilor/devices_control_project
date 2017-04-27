<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdSmart.Device.control
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为HdIot.Device.control
            </pre>
            <div v-for="msg in messages">
                {{msg}}
            </div>
        </div>
        <div class="panel-footer">
            <button class="btn btn-default" @click="onOpen">打开</button>
            <button class="btn btn-default" @click="onPause">暂停</button>
            <button class="btn btn-default" @click="onClose">关闭</button>
        </div>

    </div>
</template>
<script>
    export default {
        name: "ready",
        data (){
            return {
                messages: ["等待点击 ..."]
            }
        },
        methods: {
            onOpen (){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'on'
                }, (data) => {
                    this.messages.push('open成功=>' + JSON.stringify(data));
                }, (error) => {
                    this.messages.push('open失败=>' + JSON.stringify(error));
                })
            },

            onPause (){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'pause'
                }, (data) => {
                    this.messages.push('pause成功=>' + JSON.stringify(data));
                }, (error) => {
                    this.messages.push('pause失败=>' + JSON.stringify(error));
                })
            },

            onClose (){
                HdSmart.Device.control('setZigbeeCurtain', 'setOnoff', {
                    mode: 'off'
                }, (data) => {
                    this.messages.push('off成功=>' + JSON.stringify(data));
                }, (error) => {
                    this.messages.push('off失败=>' + JSON.stringify(error));
                })
            }
        }
    }
</script>