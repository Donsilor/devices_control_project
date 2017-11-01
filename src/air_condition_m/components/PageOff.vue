<template>
<div class="wrap-off">

    <div class="bg"></div>

    <div class="header">
        <span class="name">{{device.name}}</span>
        <span class="status">已关闭</span>
    </div>

    <div class="ac1" v-if="device.category_id===0"></div>
    <div class="ac2" v-else></div>

    <a href="#" class="btn-on" @click.prevent="setOn($event)"></a>

</div>
</template>

<script>
export default {
    props: {
        control: {
            type: Function
        },
        device: {
            type: Object
        }
    },
    methods: {
        setOn(event) {
            this.control('switch', 'on', event.target)
        }
    }
}
</script>

<style lang="less" scoped>
.wrap-off{
    background:#f2f2f2;
}
.bg{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 480px;
    width: 100%;
    background: url(../assets/img_bg_aircon_off@2x.png) no-repeat;
    background-size: 100%;
}
.header{
    text-align: center;
    width: 100%;
    position: absolute;
    left: 0;
    top: 208px;
    .name{
        font-size: 32px;
        color:#75787a;
        display: block;
        margin-bottom: 12px;
    }
    .status{
        font-size: 28px;
        color:#c8cacc;
    }
}
.ac1,.ac2{
    position: absolute;
    left: 50%;
    top: 370px;
    width: 360px;
    height: 240px;
    background-image: url(../assets/img_aircon_off@2x.png);
    background-size: 100% 100%;
    transform: translateX(-50%);
}
.ac2{
    background-image: url(../assets/img_aircon1_off@2x.png);
}
.btn-on{
    position: absolute;
    left: 50%;
    top: 600px;
    width: 144px;
    height: 144px;
    transform: translateX(-50%);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(../assets/btn_aircon_poweron_normal@2x.png);
    &:active{
        background-image: url(../assets/btn_aircon_poweron_pressed@2x.png);
    }
}
</style>
