<template>
 <div>
   <time-pick class="pickTime" @selectedchange="selectedchange" />
 </div>
</template>

<script>
  import timePick from './timePick.vue'
    export default {
      components: {
        'time-pick': timePick
      },
      data() {
        return {
          time: ''
        }
      },
      methods: {
        selectedchange(val) {
          this.time = val
        }
      }
    }
</script>

<style scoped>

</style>
