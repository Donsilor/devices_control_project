<template>
    <i :class="className" :title="title" :style="styleObj" @click="onClick" />
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        onClick: {
            type: Function,
            default: function() {}
        },
        className: {
            type: String,
            default: ''
        },
        styleObj: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {};
    },

    methods: {}
};
</script>
