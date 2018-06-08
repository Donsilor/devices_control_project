<!--
    导航条
-->
<template>
    <div class="topbar">
        <div class="left">
            <a class="icon icon-arrow" @click="goBack"></a>
        </div>
        <div class="right">
            <router-link to="/search" class="icon icon-search"></router-link>
        </div>
        <div class="title" v-if="title">{{title}}</div>
        <slot></slot>
    </div>
</template>

<style lang="less">
.topbar {
    background: #f2f2f2;
    height: 100px;
    border-bottom: 1px solid #dbdbdb;
    position: relative;
    .left {
        position: absolute;
        top: 0;
        left: 0;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
    }
    .title {
        text-align: center;
        line-height: 100px;
        font-size: 36px;
    }
    .icon {
        width: 84px;
        height: 100px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 36px 36px;
        background-position: center center;
    }
    .icon-arrow {
        background-image: url(../../../lib/base/tv/assets/icn_topbar_back_normal@2x.png);
        &:active {
            background-image: url(../../../lib/base/tv/assets/icn_topbar_back_pressed@2x.png);
        }
    }
    .icon-search {
        background-image: url(../../../lib/base/tv/assets/icn_topbar_search_normal@2x.png);
        &:active {
            background-image: url(../../../lib/base/tv/assets/icn_topbar_search_pressed@2x.png);
        }
    }
}

@media only screen and (-webkit-min-device-pixel-ratio: 3),
    only screen and (min-device-pixel-ratio: 3) {
    .topbar {
        height: 116px;
        .title {
            line-height: 116px;
        }
        .icon {
            height: 116px;
        }
    }
}

.isIOS .topbar {
    height: 88px;
    .title {
        line-height: 95px;
    }
    .icon {
        height: 88px;
    }
}
.topbar-fixed {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 2;
}
</style>

<script>
export default {
    props: {
        title: String
    },
    data() {
        return {};
    },
    methods: {
        goBack() {
            this.$router.back();
        }
    }
};
</script>
