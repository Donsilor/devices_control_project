<template>
    <router-view></router-view>
</template>

<style lang="scss">
    *{
        padding: 0;
        margin: 0; 
    }
    a{  
        text-decoration: none;
    }
    ul{ 
        list-style: none;
    }
    .clearfix:after{  
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
</style>