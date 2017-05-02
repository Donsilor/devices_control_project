<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>
                <router-link to="/" class="pull-left">返回</router-link>
                HdSmart.UI.setWebViewTouchRect
            </h4>
        </div>
        <div class="panel-body">
            <pre class="text-left">
//该函数所封装的对应的app函数为HdIot.UI.setTouchRect
HdSmart.UI.alert('弹出测试', 'hello test', () => {
    this.messages.push('已点击确认');
});
            </pre>
            <div v-for="msg in messages">
                {{msg}}
            </div>
        </div>
        <div class="panel-footer">
            <button class="btn btn-default" @click="onClick(0,0,100,100)">点击按钮1</button>
            <button class="btn btn-default" @click="onClick(0,0,'100%','100%')">点击按钮2</button>
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
            onClick (left, top, right, bottom){

                HdSmart.UI.setWebViewTouchRect(left, top, right, bottom);
                this.messages.push(`[${left},${top}],[${right},${bottom}]`);
            }
        }
    }
</script>