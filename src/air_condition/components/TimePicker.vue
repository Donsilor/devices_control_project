<template>
    <section v-show="showSelectPanel" class="select-panel">
        <header>{{title}}</header>
        <main></main>
        <footer>
            <button type="button" class="button button-cancel">取消</button>
            <button type="button" class="button button-confirm">确定</button>
        </footer>
    </section>
</template>

<style scoped>
    *{
        font-size: 30px;
    }
    .select-panel .button{
        font-size: 36px;
    }
    .select-panel header{
        box-shadow: inset 0 -1px 0 0 #dbdbdb;
        line-height: 84px;
    }
</style>

<script>
    export default{
        name: 'time-picker',
        props:
            {
                value: String,
                title: String
            },
        data(){
            return{
                showSelectPanel: true
            }
        },
        methods:{
            setPanelVisibility: function (visible) {
                this.showSelectPanel = visible;
            },
            showPanel: function () {
                this.setPanelVisibility(true);
            },
            hidePanel: function () {
                this.setPanelVisibility(false);
            }
        }
    }
</script>
