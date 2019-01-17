<template>
    <div class="control-container">
        <div class="box tap-box">
            <div class="tap icon-per20" @click="onGo(20)">20%</div>
            <div class="tap icon-per50" @click="onGo(50)">50%</div>
            <div class="tap icon-per80" @click="onGo(80)">80%</div>
            <div class="tap icon-per100" @click="onGo(100)">100%</div>
        </div>
        <div class="box button-box">
            <div class="off button" @click="onCloseTouchStart" :class="[loading_type=='off' ? 'loading':'normal']">
                <i class="icon-off"></i>关
            </div>
            <div class="pause button" @click="onPauseTouchStart" :class="[loading_type=='pause' ? 'loading':'normal']">
                <i class="icon-pause"></i>暂停
            </div>
            <div class="on button" @click="onOpenTouchStart" :class="[loading_type=='on' ? 'loading':'normal']">
                <i class="icon-on"></i>开
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        is_ready: Boolean
    },
    data() {
        return {
            loading_type: "",
            timer: null
        };
    },
    methods: {
        stopLoading() {
            this.loading_type = "";
            clearTimeout(this.timer);
        },
        delayLoading(callback) {
            this.timer = setTimeout(() => {
                callback();
            }, 300);
        },
        onOpenTouchStart() {
            if (!this.is_ready) return false;
            if (this.loading_type != "on") {
                this.stopLoading();
                this.delayLoading(() => {
                    this.loading_type = "on";
                });
                this.$emit("onOpen", () => {
                    this.stopLoading();
                });
            }
        },
        onCloseTouchStart() {
            if (!this.is_ready) return false;
            if (this.loading_type !== "off") {
                this.stopLoading();
                this.delayLoading(() => {
                    this.loading_type = "off";
                });
                this.$emit("onClose", () => {
                    this.stopLoading();
                });
            }
        },
        onPauseTouchStart() {
            if (!this.is_ready) return false;
            if (this.loading_type !== "pause") {
                this.stopLoading();
                this.delayLoading(() => {
                    this.loading_type = "pause";
                });
                this.$emit("onPause", () => {
                    this.stopLoading();
                });
            }
        },
        onGo(target_percentage) {
            //return () => {
            if (!this.is_ready) return false;
            this.stopLoading();
            this.$emit("onGoPercentage", target_percentage);
            //}
        }
    }
};
</script>
