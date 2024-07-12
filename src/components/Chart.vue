<template>
    <main>
        <DatePicker></DatePicker>
        <div ref="chart" class="chart">
            <svg>
                <g v-for="(sectorToStations, index) in this.sectorsToSations" :key="sectorToStations.sector.id" :transform="'translate(' + 0 + ',' + sectorToStations.yPos+ ')'">
                    <text :y="sectorToStations.yPos + this.stationHeight" :x="0" :width="this.labelsXOffset" :height="this.stationHeight">{{ sectorToStations.sector.name }}</text>
                    <g v-for="(station, stationIndex) in sectorToStations.stations" :transform="'translate(' + 0 + ',' + sectorToStations.yPos+ this.stationHeight + ')'">
                        <text :y="sectorToStations.yPos + stationIndex * this.stationHeight + this.stationHeight" :x="0" :width="this.labelsXOffset" :height="this.stationHeight">{{ station.name }}</text>
                        <rect :y="sectorToStations.yPos + stationIndex * this.stationHeight" :x="0+this.labelsXOffset" width="100%" :height="this.stationHeight" fill="red"></rect>
                    </g>
                </g>
            </svg>
        </div>
        
    </main>
</template>
<script>
import Station from './Station.vue';
import DatePicker from './DatePicker.vue';
export default {
    components: {Station, DatePicker},
    data() {
        return {
            
        }
    },
    methods: {
    },
    computed: {
    },
    mounted() {
        this.$store.commit("setChartWidth", this.$refs.chart.offsetWidth);
    },
}
</script>
<style scoped>
    svg {
        width: 100%;
        height: 100%;
        background: blue;
        display: block;
    }
    .chart {
        
        width: 100%;
        height: 100%;
    }
   
</style>