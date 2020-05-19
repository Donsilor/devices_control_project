<template>
  <div class="button">
    <div 
      class="imgWrapper" 
      @click="tap"/>
    <span 
      v-if="info.title" 
      class="btnName">{{ info.title }}</span>
  </div>
</template>

<script>
    export default {
        /**
         * info属性说明
         * title: 按钮title，底部文字
         * type: 控制的属性类型
         * value: 控制的属性值
         * tip: 控制成功提示文字
         * continuousClick: 是否允许连续点击
         * */
        props: {
            info: {
                type: Object,
                default() {
                    return {
                        title: ''
                    }
                }
            }
        },
        data: function() {
            return{
                processing: false,
                processingTimer: null
            }
        },
        methods:{
            tap(){
                //不允许连续点击，添加timer及tag判断
                if(!this.info.continuousClick){
                    if(this.processing){
                        return
                    }

                    this.processing = true
                    clearTimeout(this.processingTimer)
                    this.processingTimer = setTimeout( ()=> {
                        this.processing = false
                    }, 300)
                }

                this.$emit('tap', this.info.type, this.info.value, this.info.tip, this.$el)
            }
        }
    }
</script>
