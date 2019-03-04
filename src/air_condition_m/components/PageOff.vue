<template>
    <div class="wrap-off">
        <div class="topbar topbar-fixed">
            <div class="left">
                <a href="#/" class="icon-return" @click.prevent="back"/>
            </div>
            <div class="title">智能空调</div>
            <div class="right">
                <!--<a href="" class="icon-more"></a>-->
            </div>

        </div>
        <!--<div class="bg"></div>-->

        <div class="header">
            <p class="name">
                <!--{{device.name}}
                <icon/>-->
                挂式空调
            </p>
            <p class="status">已关闭</p>
        </div>

        <div class="ac1"></div>
        <!-- <div class="ac2" v-else></div> -->

        <a href="#" class="btn-on icon-switch" @click.prevent="setOn($event)"></a>

    </div>
</template>

<script>
import Icon from '../../../lib/components/SettingIconMobile.vue';
export default {
    components: {
        Icon
    },
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
            this.control('switch', 'on', event.target);
        }
    }
};
</script>
