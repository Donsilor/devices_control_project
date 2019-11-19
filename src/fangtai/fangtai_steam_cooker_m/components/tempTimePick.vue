<template>
 <div>
   <time-pick class="pickTime" @selectedchange="selectedchange" :activeMode="activeMode" />
 </div>
</template>

<script>
  import timePick from './timePick.vue'
    export default {
      components: {
        'time-pick': timePick
      },
      props: {
        activeMode: {
          type: Number
        }
      },
      data() {
        return {
          time: '70:00:30'
        }
      },
      created() {

      },
      methods: {
        selectedchange(val) {
          this.time = val
        }
      },
      watch: {
        activeMode(val) {
          if (val === 0) {
            this.time = '70:00:30'
          } else if (val === 1) {
            this.time = '00:00:30'
          } else if (val === 2) {
            this.time = '10:00:30'
          }
        }
      }
    }
</script>

<style scoped>

</style>
