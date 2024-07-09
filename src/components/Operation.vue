<template>
    <p class="operation" :style="{ width: this.operation.width + 'px', left: this.posX + 'px'}"
    :class="{operation__selected : this.isSelected }"
    @mousedown="this.onMouseDown">
        {{this.operation.name}}
    </p>
</template>
<script>
export default {
    props: {
        operation: Object
    },
    data() {
        return {
            dragging: false,
            offsetX: 0,
            posX: 0
        }
    },
    mounted() {
        this.posX = this.operation.startPosition;
    },
    methods: {
        onMouseDown(event) {
            this.dragging = true;
            this.offsetX = event.clientX - this.posX;
            
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);

            this.$store.commit("selectOperation", this.operation.id);
            this.$emit("dragStart")
        },
        onMouseMove(event) {
            if (this.dragging) {
                this.posX = event.clientX - this.offsetX;
            }
        },
        onMouseUp() {
            this.dragging = false;

            const offset = this.posX - this.operation.startPosition;
            this.$store.commit("moveSelected", offset);

            this.$emit("dragEnd")

            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
    },
    computed: {
        isSelected() {
            return this.$store.getters.isSelected(this.operation.id);
        }
    }
}
</script>
<style scoped>
    .operation {
        height: 20px;
        position: relative;
        background: red;
        border-radius: 5px;
        font-size: small;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: 1px solid black;
    }
    .operation:hover {
        background: rgb(131, 0, 0);
    }

    .operation__selected {
        border: 2px solid black;
        background: green;
    }

</style>