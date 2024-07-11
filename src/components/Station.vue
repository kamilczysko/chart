<template>
    <div class="station" @mouseover="over" @dblclick="dbclick">
        <p class="label">{{ this.station.name }}</p>
        <Operation v-for="(operation, index) in this.allOperations" :key="operation.id" :operation="operation"
        @dragEnd="dragEnd"
        ></Operation>
    </div>
</template>
<script>
import Operation from './Operation.vue';
export default {
    components: {Operation},
    props: {
        station: Object
    },
    data() {
        return {
        }
    },
    computed: {
        allOperations() {
            return this.$store.getters.getOperations(this.station.id);
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
            this.$store.commit("addNewOperation", data)
            
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
</style>