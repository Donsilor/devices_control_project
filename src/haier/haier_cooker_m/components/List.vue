<template>
  <div class="page-list">
    <!-- 顶部条 -->
    <div class="log-box">
      <div class="topbar topbar-fixed">
        <div class="left">
          <router-link
            to="/"
            class="icon-return"
          />
        </div>
        <div class="title">
          警告记录
        </div>
        <div class="right">
          <a
            href=""
            class="icon-del"
            @click.prevent="clearLog"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script>

</script>
