<template>
    <div class="station">
        <p>station: {{ this.station.name }}</p>
        <Operation v-for="operation in this.operations" :key="operation.id" :operation="operation"></Operation>
    </div>
</template>
<script>
import Operation from './Operation.vue';
export default {
    components: {Operation},
    props: {
        station: Object
    },
    computed: {
        operations() {
            const timeRange = this.$store.getters.getTimestamps;
            return this.$store.getters.getOperations(this.station.id, timeRange.start, timeRange.end);
        }
    }
}
</script>
<style scoped>
    
</style>