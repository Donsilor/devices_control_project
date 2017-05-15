<template>
    <div id="app">
        <div class="js_status is_ready" v-if="is_ready">JavaScript准备好了</div>
        <div class="js_status is_un_ready" v-if="!is_ready">JavaScript还没准备好</div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data (){
            return {
                is_ready: false
            }
        },
        mounted (){
            HdSmart.ready(() => {
                this.is_ready = true;
            });
        }
    }
</script>

<style>
    .js_status{
        position: fixed;
        width: 100%;
        height: 100px;
        line-height: 100px;
        left: 0;
        top:0;
        z-index: 1000;
        color: #ffffff;
    }
    .is_ready{
        background: green;
    }
    .is_un_ready{
        background: red;
    }
    html {
        height: 100%;
    }

    body {
        height: 100%;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 100px;
    }
</style>
