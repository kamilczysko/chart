<template>
    <div class="sector">
                <div class="label">
                    <p  v-on:click="this.visible = !this.visible">{{this.name}}</p>
                    <img src="../assets/triangle.png" alt="" :class="{closed:!this.visible}">
                </div>
                <div class="station-container">
                    <Station v-for="(station, index) in this.stations" :key="station.id" :station="station" v-if="this.visible"  :class="{highlight:index%2==1}"></Station>
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
        /* background: pink; */
        user-select: none;
    }
    /* .sector:hover {
        background: pink;
    } */
    .label {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 10px;
        cursor: pointer;
        border-top: 1px solid black;
    }
    .label:hover {
        font-weight: bold;
    }
    .label img{
        width: 8px;
        height: 8px;
        rotate: 90deg;
    }
    .closed {
        rotate: 180deg!important;
    }
    .station-container {
        min-height: 10px;
    }
    .highlight {
        background: rgb(228, 228, 228);
    }
    
</style>