<template>
    <main>
        <!-- <DatePicker></DatePicker> -->
        <div ref="chart" class="chart">
            <svg>
                <g v-for="(sectorToStations, idx) in this.sectorsToStations">
                    <text x="0" :y="sectorToStations.yPos" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle"> {{ sectorToStations.sector.name }} </text>
                    <g v-for="(station, index) in sectorToStations.stations">
                        <text  x="70" :y="sectorToStations.yPos + index * this.defaultHeight" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle"> {{ station.name }} </text>
                        <rect :x="this.labelsWidth" :y="sectorToStations.yPos + index * this.defaultHeight" :height="this.defaultHeight" fill-opacity="0.4" width="100%" fill="white" :class="{highlight: (this.getGlobalIndex()%2==0)}"></rect>
                    </g>

                    <line x1="0" :y1="sectorToStations.yPos - 2" x2="200" :y2="sectorToStations.yPos - 2" stroke="black"></line>
                    <!-- <rect x="100" y="0" height="20" width="100" fill="red"></rect> -->
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
            globalIdx: 0
        }
    },
    methods: {
        getGlobalIndex() {
            this.globalIdx ++;
            return this.globalIdx;
        }
    },
    computed: {
        sectorsToStations() {
            return this.$store.getters.getSectorToStation;
        },
        defaultHeight() {
            return this.$store.getters.getDefaultHeight;
        },
        labelsWidth() {
            return this.$store.getters.getLabelsWidth;
        }
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
        background: rgb(197, 197, 238);
        display: block;
    }
    .chart {
        width: 100%;
        height: 100%;
    }
    .highlight {
        fill:rgb(223, 223, 223);
    }

   
</style>