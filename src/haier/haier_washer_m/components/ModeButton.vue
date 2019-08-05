<template>
  <a 
    :class="btnStyle" 
    href="" 
    @click.prevent="onClick">
    <i/>
    <slot />
  </a>
</template>


<script>
export default {
    props: ['mode'],
    data() {
        return {
            root: this.$parent.$parent
        }
    },
    computed: {
        btnStyle() {
            return [
                'btn',
                'btn-mode-' + this.mode,
                {
                    active:  this.root.model.mode == this.mode,
                    disable: this.root.isRun || this.root.isPause
                }
            ]
        },
    },
    methods: {
        onClick() {
            this.root.setMode(this.mode)
        }
    }
}
</script>
