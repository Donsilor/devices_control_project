<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdIot.Util.reload - HdSmart.Util.reload
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为HdIot.Util.reload
HdSmart.Util.reload()
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
        name: "getNetworkType",
        data (){
            return {
                messages: ["等待点击 ..."]
            }
        },
        methods: {
            onClick (){
                this.messages.push('just reloading')
                HdSmart.Util.reload();
            }
        }
    }
</script>