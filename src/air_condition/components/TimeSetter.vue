<template>
    <div class="timer">
        <span>{{desc}}</span>
        <time-picker :value="value" :title="title"></time-picker>
    </div>
</template>

<style scoped></style>

<script>
    import TimePicker from './TimePicker.vue';
    export default{
        name: 'time-setter',
        props:
            {
                desc: String,
                on: Boolean,
                value: String,
                title: String
            },
        components: { TimePicker }
    }
</script>
