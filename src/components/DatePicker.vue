<template>
    <div class="date_wrapper">
        <VueDatePicker v-model="this.dateRange" range model-value="range" 
                model-type="timestamp"
                auto-apply :enable-time-picker="false"
                @update:model-value="handleDateChange"
                placeholder="Select date range">
            </VueDatePicker>
    </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


export default {
    components: {VueDatePicker},
    data() {
        return {
            dateRange: []
        }
    },
    methods: {
        handleDateChange(date) {
            this.$store.commit("setStartTimestamp", this.startOfDay(date[0]))
            this.$store.commit("setEndTimestamp", this.endOfDay(date[1]))
        },
        startOfDay(timestamp) {
            const date = new Date(timestamp);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        },
        endOfDay(timestamp) {
            const date = new Date(timestamp);
            date.setHours(23,59, 0, 0);
            return date.getTime();
        }
    },
    computed: {
        timestamps() {
            return this.$store.getters.getTimestamps
        }
    },
    mounted() {
        const sts = this.timestamps;
        this.dateRange = [sts.start, sts.end];
    }
}
</script>
<style>
 
</style>