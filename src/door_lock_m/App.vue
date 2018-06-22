<template>
<div id="app">
    <router-view></router-view>
</div>
</template>

<style lang='less'>
    *{
        padding: 0;
        margin: 0;
    }
    a{
        text-decoration: none;
    }
    body{
        font-size: 30px;
    }
    html{
        padding-bottom: 2px;
    }
    .picker-toolbar{
        display: none !important;
        border:1px solid red;
    }
    .v-modal{
        display:none;
    }

</style>

<script>
export default {
    data() {
        return {

        }
    },

}
</script>
