<template>
    <main>
        <div class="dummy">
            <VueDatePicker v-model="this.date" range model-value="range" model-type="timestamp" auto-range="1" auto-apply placeholder="Select day"></VueDatePicker>
        </div>
        <div class="chart" ref="chart">
            <header> {{this.date}} </header>
            <Sector  v-for="sector in this.sectors" :key="sector.id" :label="sector.name" :id="sector.id" ></Sector>
        </div>
    </main>
</template>
<script>
import Sector from './Sector.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
export default {
    components: {Sector, VueDatePicker},
    data() {
        return {
            date: new Date()
        }
    },
    methods: {
    },
    computed: {
        sectors() {
            return this.$store.getters.getSectors;
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