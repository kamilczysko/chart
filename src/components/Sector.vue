<template>
    <div class="sector" v-on:click="this.visible = !this.visible">
                <p class="label">{{this.name}}</p>
                <div class="station-container">
                    <Station v-for="station in this.stations" :key="station.id" :station="station" v-if="this.visible"></Station>
                </div>
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
    data() {
        return {
            visible: true
        }
    },
    computed: {
        stations() {
            return this.$store.getters.getStationsForSector(this.id);
        }
    }
}
</script>
<style scoped>
    .sector {
        height: 100%;
    }
    .label {
        position: fixed;
        left: 30px;
    }
    .station-container {
        min-height: 50px;
    }
    
</style>