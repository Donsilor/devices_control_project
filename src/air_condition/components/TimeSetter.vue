<template>
    <div class="timer">
        <span>{{title}}</span>
        <time-picker :value="value" :title="title"></time-picker>
    </div>
</template>

<style scoped></style>

<script>
    import TimePicker from './TimePicker.vue';
    export default{
        props:
            {
                title: String,
                on: Boolean,
                value: String
            },
        components: [TimePicker]
    }
</script>
