<template>
    <g class="station" @mouseover="over" @dblclick="dbclick" :transform="'translate(' + 0 + ',' + this.index * 30 + ')'">
            <rect x="0" width="100%" :height="this.stationHeight-4" fill="red"></rect>
            <Operation v-for="operation in this.allOperations" :key="operation.id" :operation="operation" @dragEnd="dragEnd" v-if="currentComponent"></Operation>
    </g>
</template>
<script>
import Operation from './Operation.vue';
export default {
    components: {Operation},
    props: {
        station: Object,
        index: Number
    },
    data() {
        return {
            currentComponent: false,
            operationsToDraw: []
        }
    },
    mounted() {
        // this.$nextTick(() => {
            this.currentComponent = true;
        // });
    },
    computed: {
        allOperations() {
            return this.$store.getters.getOperations(this.station.id);
        },
        stationHeight() {
            return this.$store.getters.getGraphicsParams.operationHeight
        }
    },
    methods: {
        dragEnd(event) {
            this.$store.commit("changeStation");
        },
        over(event) {
            this.$store.commit("setTargetStation", this.station.id);
        },
        dbclick(event) {
            const rect = event.target.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left);
            const data = {
                startPosition: mouseX,
                stationId: this.station.id
            }
            this.$store.commit("addNewOperation", data);
        }
    }
}
</script>
<style scoped>
    .station {
        position: relative;
        min-height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }
    .station:hover {
        /* background: palevioletred; */
    }
    .label {
        position: fixed;
        left: 90px;
    }
    g {
        width: 100%;
        height: 100%;
    }
</style>