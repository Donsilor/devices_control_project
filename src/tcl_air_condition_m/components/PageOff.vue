<template>
  <div class="wrap-off">
    <div class="topbar topbar-fixed">
      <div class="left">
        <a
          href="#/"
          class="icon-return"
          @click.prevent="back"/>
      </div>
      <div class="title">{{ device.name }}</div>
      <div class="right">
        <!--<a href="" class="icon-more"></a>-->
      </div>

    </div>

    <!--<div class="bg"></div>-->

    <div class="header">
      <!--<p class="name">{{device.name}}-->
      <!--<icon />-->
      <!--</p>-->
      <p class="status">已关闭</p>
    </div>

    <div v-if="device.category_id == 1 || device.category_id == 5001" 
class="ac2"/>
    <div v-else 
class="ac1"/>

    <a 
href="#"
       class="btn-on icon-switch" 
@click.prevent="setOn($event)"/>

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
        back() {
            HdSmart.UI.popWindow()
        },
        setOn(event) {
            this.control('switch', 'on', event.target);
        }
    }
};
</script>
