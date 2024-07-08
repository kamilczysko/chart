<template>
    <div class="sector">
                <p>sector: {{this.name}}</p>
                <Station v-for="station in this.stations" :key="station.id" :station="station"></Station>
            </div>
</template>
<script>
import Station from './Station.vue';
export default {
    components: {Station},
    props: {
        name: String,
        id: Number
    },
    computed: {
        stations() {
            return this.$store.getters.getStationsForSector(this.id);
        }
    }
}
</script>
<style scoped>
    
</style>