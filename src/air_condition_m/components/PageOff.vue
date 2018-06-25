<template>
    <div class="wrap-off">

        <div class="bg"></div>

        <div class="header">
            <span class="name">{{device.name}}</span>
            <span class="status">已关闭</span>
        </div>

        <div class="ac1"></div>
        <!-- <div class="ac2" v-else></div> -->

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
    data() {
        return {};
    },
    methods: {
        setOn(event) {
            this.control("switch", "on", event.target);
        }
    }
};
</script>
