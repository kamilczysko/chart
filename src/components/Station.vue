<template>
    <div class="station" @mouseover="over">
        <p class="label">{{ this.station.name }}</p>
        <Operation v-for="operation in this.allOperations" :key="operation.id" :operation="operation"
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
    }
    .station:hover {
        background: palevioletred;
    }
    .label {
        position: fixed;
        left: 90px;
    }
</style>