<template>
    <main>
        <DatePicker></DatePicker>
        <div ref="chart" class="chart" @mousemove="over">
            <svg>
                <!-- cursor -->
                <g> 
                    <line :x1="this.mouseX" :y1="this.defaultHeight * 2 + 5" :x2="this.mouseX" y2="100%" stroke="black"  stroke-width="1"></line>
                    <text :x="this.mouseX+ 3" :y="this.defaultHeight * 2 + 10" font-size=".6em" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle">{{ this.timeIndicator }}</text>
                </g>
                <!-- days -->
                <g v-for="time in this.generateDailyTimestamps(this.startTimestamp, this.endTimestamp)">
                    <text :x="(time-this.startTimestamp) / this.ratio + this.labelsWidth + 3" :y="this.defaultHeight" font-size=".8em"> {{this.formatTimestamp(time) }}</text>
                    <line :x1="(time-this.startTimestamp) / this.ratio + this.labelsWidth" y1="0" :x2="(time-this.startTimestamp) / this.ratio + this.labelsWidth" y2="100%" stroke="black"  stroke-width="1"></line>
                </g>
                <!-- hours -->
                <g v-for="time in this.generateHourlyTimestamps(this.startTimestamp, this.endTimestamp)">
                    <text :x="(time-this.startTimestamp) / this.ratio + this.labelsWidth + 3" :y="this.defaultHeight * 2" font-size=".65em"> {{this.formatTime(time) }}</text>
                    <line :x1="(time-this.startTimestamp) / this.ratio + this.labelsWidth" :y1="this.defaultHeight" :x2="(time-this.startTimestamp) / this.ratio + this.labelsWidth" y2="100%" stroke="#c4c4c4"  stroke-width="1"></line>
                </g>
                
                <g v-for="(sectorToStations, idx) in this.sectorsToStations"  transform="translate(0,70)">
                    <text x="0" :y="sectorToStations.yPos" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle" font-size=".85em" style="user-select: none;"> {{ sectorToStations.sector.name }} </text>
                    <g v-for="(station, index) in sectorToStations.stations">
                        <text  x="70" :y="sectorToStations.yPos + index * this.defaultHeight" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle"  font-size=".85em" style="user-select: none;"> {{ station.name }} </text>
                        <rect
                        @mouseover="this.moveToStation(station.id)"
                        @mouseup="this.dragStop()"
                        @dblclick="addNewOperation(station.id, $event)"
                        :x="this.labelsWidth" :y="sectorToStations.yPos + index * this.defaultHeight" :height="this.defaultHeight" fill-opacity="0.4" width="100%" fill="white" ></rect>
                        <line :x1="0" :y1="sectorToStations.yPos + index * this.defaultHeight" x2="100%" :y2="sectorToStations.yPos + index * this.defaultHeight" stroke="#c4c4c4"  stroke-width="1"></line>
                        
                        <Operation
                        v-for="operation in this.operations.filter(op => op.stationId == station.id)"
                        @mousedown="dragStart(operation.id, $event)"
                        :y="sectorToStations.yPos + index * this.defaultHeight" :id="operation.id"></Operation>                       

                    </g>
                    <line x1="0" :y1="sectorToStations.yPos" x2="100%" :y2="sectorToStations.yPos" stroke="black" stroke-width="1"></line>
                </g>
                
                
            </svg>
        </div>
        
    </main>
</template>
<script>
import DatePicker from './DatePicker.vue';
import Operation from './Operation.vue';
export default {
    components: {DatePicker, Operation},
    data() {
        return {
            globalIdx: 0,
            operations: [],
            mouseX: 0,
            timeIndicator: "",

            dragging: false,
            operationToMove: null
        }
    },
    methods: {
        moveToStation(stationId) {
            if(this.dragging && !isNaN(stationId)) {
                this.$store.commit("updateTargetStationId", stationId)
                this.$store.commit("updateOperationsStation")
                this.operations = []
                this.$nextTick(() => {
                    this.operations = this.$store.getters.getOperations;
                });
            }
        },
        dragStart(operationId, event) {
            this.dragging = true;
            this.operationToMove = operationId;

            document.addEventListener('mousemove', this.moveToStation);
            document.addEventListener('mouseup', this.dragStop);
        },
        dragStop() {
            this.dragging = false;
            
            document.removeEventListener('mousemove', this.moveToStation);
            document.removeEventListener('mouseup', this.dragStop);

            this.$nextTick(() => {
                this.operations = this.$store.getters.getOperations;
                // this.operations = this.$store.getters.getOperations;
            });

        },
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        },
        formatTime(timestamp) {
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        },
        generateDailyTimestamps(startTimestamp, endTimestamp) {
            const timestamps = [];
            const startDate = new Date(startTimestamp);

            timestamps.push(startTimestamp);

            let nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1).getTime();

            while (nextDay < endTimestamp) {
                timestamps.push(nextDay);
                nextDay += 24 * 60 * 60 * 1000; 
            }

            return timestamps;
        },
        generateHourlyTimestamps(startTimestamp, endTimestamp) {
            const timestamps = [];
            const startDate = new Date(startTimestamp);
            let hourcounter = 0;

            timestamps.push(startTimestamp);

            let nextHours = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();

            while (nextHours < endTimestamp) {
                nextHours += 4 * 60 * 60 * 1000; 
                hourcounter += 4;
                if(hourcounter == 0) {
                    hourcounter = 0;
                    continue;
                }
                timestamps.push(nextHours);
            }

            return timestamps;
        },
        over(event) {
            const rect = this.$refs.chart.getBoundingClientRect();
            if((event.clientX - rect.left) > this.labelsWidth) {
                this.mouseX = (event.clientX - rect.left);// - this.labelsWidth;
                this.timeIndicator = this.formatTime((this.mouseX-this.labelsWidth) * this.ratio + this.startTimestamp);
            }
        },
        addNewOperation(station, event) {
            this.$store.commit("addNewOperation", {station: station, x: event.clientX - this.labelsWidth})
            this.operations = this.$store.getters.getOperations;
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
        ratio() {
             return this.$store.getters.getTimeToPXRatio;
        },
        allOperations() {
            return this.$store.getters.getOperations;
        }
    },
    watch: {
        startTimestamp(oldVal, newVal) {
            this.operations = this.$store.getters.getOperations;
        },
        endTimestamp(oldVal, newVal) {
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