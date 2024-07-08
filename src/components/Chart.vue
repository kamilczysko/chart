<template>
    <main>
        <div class="dummy">c</div>
        <div class="chart" ref="chart">
            <header> timeline </header>
            <Sector  v-for="sector in this.sectors" :key="sector.id" :label="sector.name" :id="sector.id" ></Sector>
        </div>
    </main>
</template>
<script>
import Sector from './Sector.vue';
export default {
    components: {Sector},
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