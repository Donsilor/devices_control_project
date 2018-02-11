<template>
<div class="loglist">
    <template v-if="1">
        <span class="current_date">今天</span>
        <ul>
            <li v-for="item in data" :key="item">
                <span class="dot"></span>
                <span class="date">15:39</span>
                <span class="text">Steven通过手机App开锁</span>
            </li>
        </ul>
    </template>
    <div class="nodata" v-else>
        <span></span>
        本日暂无记录
    </div>
</div>
</template>


<style lang="less" scoped>
    .loglist{

    }
    .nodata{
        font-size:30px;
        color:#c8cacc;
        text-align: center;
        span{
            background: url(../assets/img_emptydata.png) no-repeat;
            background-size: 100% 100%;
            display: block;
            width: 360px;
            height: 360px;
            margin:250px auto 36px;
        }
    }
</style>


<script>
export default {
    props: ['data']
}
</script>
