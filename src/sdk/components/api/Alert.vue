<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdSmart.UI.alert
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为HdIot.UI.Alert
HdSmart.UI.alert('弹出测试', 'hello test', () => {
    this.messages.push('已点击确认');
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
                messages: ["等待点击 ..."]
            }
        },
        methods: {
            onClick (){
                HdSmart.UI.alert('弹出测试', 'hello test', () => {
                    this.messages.push('已点击确认');
                });
            }
        }
    }
</script>