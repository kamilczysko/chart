<template>
    <main>
        <DatePicker></DatePicker>
        <div ref="chart" class="chart">
            <svg>
                <g v-for="(sectorToStations, idx) in this.sectorsToStations">
                    <text x="0" :y="sectorToStations.yPos" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle"> {{ sectorToStations.sector.name }} </text>
                    <g v-for="(station, index) in sectorToStations.stations">
                        <text  x="70" :y="sectorToStations.yPos + index * this.defaultHeight" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle"> {{ station.name }} </text>
                        <rect :x="this.labelsWidth" :y="sectorToStations.yPos + index * this.defaultHeight" :height="this.defaultHeight" fill-opacity="0.4" width="100%" fill="white" :class="{highlight: (this.getGlobalIndex()%2==0)}"></rect>
                        <g v-for="operation in this.allOperations.filter(op => op.stationId==station.id)">

                            <rect  :x="operation.startPosition + this.labelsWidth" y="0" height="20" width="100" fill="red"></rect>
                        </g>
                    </g>

                    <line x1="0" :y1="sectorToStations.yPos - 2" x2="200" :y2="sectorToStations.yPos - 2" stroke="black"></line>
                </g>
            </svg>
        </div>
        <p style="display: none;">{{ this.startTimestamp }} {{ this.endTimestamp }}</p>
        
    </main>
</template>
<script>
import Station from './Station.vue';
import DatePicker from './DatePicker.vue';
export default {
    components: {Station, DatePicker},
    data() {
        return {
            globalIdx: 0,
            operations: []
        }
    },
    methods: {
        getGlobalIndex() {
            this.globalIdx ++;
            return this.globalIdx;
        },
        getOperations(stationId) {
            
            return this.operations.filter(op => op.stationId == stationId);
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
        },

        startTimestamp() {
            return this.$store.getters.getStartTimestamp;
        },
        endTimestamp() {
            return this.$store.getters.getEndTimestamp;
        },
        allOperations() {
            return this.operations;
        }
    },
    watch: {
        startTimestamp(oldVal, newVal) {
            this.operations = this.$store.getters.getOperations;
            console.log("dddd")
        },
        endTimestamp(oldVal, newVal) {
            console.log("dddd")
            this.operations = this.$store.getters.getOperations;
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