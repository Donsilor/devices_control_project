<template>
  <div class="wrap-off">

    <div class="bg"/>

    <div class="header">
      <span class="name">{{ device.name }}
        <icon />
      </span>
      <span class="status">已关闭</span>
    </div>

    <div 
      v-if="device.category_id == 1 || device.category_id == 5001" 
      class="ac2"/>
    <div 
      v-else 
      class="ac1"/>

    <a 
      href="#" 
      class="btn-on" 
      @click.prevent="setOn($event)"/>

  </div>
</template>

<script>
import Icon from "@lib/components/SettingIconMobile.vue"
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
        return {}
    },
    methods: {
        setOn(event) {
            this.control("switch", "on", event.target)
        }
    }
}
</script>
