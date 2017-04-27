<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdIot.Util.post - HdSmart.Util.post
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为HdIot.Util.post
HdSmart.Util.post('url', {}, (data) => {
    this.messages.push(JSON.stringify(data));
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
        name: "ready",
        data (){
            return {
                messages: ["等待点击 ..."]
            }
        },
        methods: {
            onClick (){
                HdSmart.Util.post('url', {}, (data) => {
                    this.messages.push(JSON.stringify(data));
                })
            }
        }
    }
</script>