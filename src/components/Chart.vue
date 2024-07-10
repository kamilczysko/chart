<template>
    <main>
        <div class="dummy" ref="dummy">
            <DatePicker></DatePicker>
        </div>
        <div class="chart" ref="chart">
            <header> 
                <p class="dayIndicator" v-for="stamp in this.generateDailyTimestamps(this.timestamps.start, this.timestamps.end)" :style="{left: ((stamp - this.timestamps.start) * this.pxToTimeRatio) + 'px'}">
                    {{this.formatTimestamp(stamp)}}    
                </p>
                <div class="indicator" :style="{left: this.mouseX+'px'}">
                    <p>{{ this.timeIndicator }}</p>
                </div>
            </header>
            <div @mousemove="over">
                <Sector  v-for="sector in this.sectors" :key="sector.id" :name="sector.name" :id="sector.id" ></Sector>
            </div>
        </div>
    </main>
</template>
<script>
import Sector from './Sector.vue';
import DatePicker from './DatePicker.vue';
export default {
    components: {Sector, DatePicker},
    data() {
        return {
            mouseX: 0,
            timeIndicator: ""
        }
    },
    methods: {
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
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        generateDailyTimestamps(startTimestamp, endTimestamp) {
            const timestamps = [];
            const startDate = new Date(startTimestamp);
            // const endDate = new Date(endTimestamp);

            timestamps.push(startTimestamp);

            let nextDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1).getTime();

            while (nextDay < endTimestamp) {
                timestamps.push(nextDay);
                nextDay += 24 * 60 * 60 * 1000; 
            }

            return timestamps;
        },
        over(event) {
            const rect = event.target.getBoundingClientRect();
            this.mouseX = (event.clientX - rect.left);
            console.log(this.mouseX)
            this.timeIndicator = this.formatTime((this.mouseX / this.pxToTimeRatio) + this.timestamps.start);
        }
    },
    computed: {
        sectors() {
            return this.$store.getters.getSectors;
        },
        timestamps() {
            return this.$store.getters.getTimestamps;
        },
        pxToTimeRatio() {
            return this.$store.getters.getPXToTimeRatio;
        }
    },
    mounted() {
        this.$store.commit("setChartWidth", this.$refs.chart.offsetWidth);
    }
}
</script>
<style scoped>
    main {
        display: grid;
        grid-template-columns: 1fr 5fr;
    }
    .dummy {
        width: 100%;
        height: 100%;
    }
    .chart {
        background: blue;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    header {
        width: 100%;
        position: relative;
        height: 50px;
    }
    .indicator {
        position: absolute;
        top: 10px;
        border-left: 1px solid black;
    }
    .dayIndicator {
        border-left: 1px solid black;
        position: absolute;
        bottom: 10px;
    }
</style>