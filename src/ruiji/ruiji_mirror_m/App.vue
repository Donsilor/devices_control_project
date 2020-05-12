<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<style>
  body{
    height: 100vh;
    background-color: #19191C;
  }
  *{
    box-sizing: border-box;
  }

</style>
