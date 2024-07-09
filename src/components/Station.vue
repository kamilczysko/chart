<template>
    <div class="station" @mouseover="over">
        <p>station: {{ this.station.name }}</p>
        <Operation v-for="operation in this.operations" :key="operation.id" :operation="operation"
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
    computed: {
        operations() {
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
        /* height: 20px; */
    }
    .station:hover {
        background: palevioletred;
    }
</style>