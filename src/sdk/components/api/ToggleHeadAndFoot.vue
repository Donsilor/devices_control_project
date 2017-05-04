<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdSmart.UI.toggleHeadAndFoot
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为HdIot.UI.toggleHeadAndFoot
HdSmart.UI.toggleHeadAndFoot(true);
HdSmart.UI.toggleHeadAndFoot(false);
            </pre>
            <div v-for="msg in messages">
                {{msg}}
            </div>
        </div>
        <div class="panel-footer">
            <button class="btn btn-default" @click="onClick(false)">点击按钮:false</button>
            <button class="btn btn-default" @click="onClick(true)">点击按钮:true</button>
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
            onClick (isShown){
                HdSmart.UI.toggleHeadAndFoot(isShown);
                this.messages.push(`status:${isShown}`);
            }
        }
    }
</script>