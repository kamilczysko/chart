<template>
    <main>
        <div class="dummy">
            <DatePicker></DatePicker>
        </div>
        <div class="chart" ref="chart">
            <header> {{this.formatTimestamp(this.timestamps.start)}}  {{this.formatTimestamp(this.timestamps.end)}} </header>
            <Sector  v-for="sector in this.sectors" :key="sector.id" :label="sector.name" :id="sector.id" ></Sector>
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
        }
    },
    methods: {
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są indeksowane od 0
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day}`;// ${hours}:${minutes}:${seconds}
        }
    },
    computed: {
        sectors() {
            return this.$store.getters.getSectors;
        },
        timestamps() {
            return this.$store.getters.getTimestamps
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
        background: red;
        width: 100%;
        height: 100%;
    }
    .chart {
        background: blue;
        width: 100%;
        height: 100%;
    }
</style>