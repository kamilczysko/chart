<template>
    <div class="operation" :style="{ width: this.width + 'px', left: this.posX + 'px'}" :class="{operation__selected : this.isSelected }" @click="click"> 
        <div class="drag" @mousedown="this.onMouseDown"></div>
        <p class="operation-label">
        {{this.operation.name}}
        </p>
        <div class="resize right" @mousedown="this.onMouseDownRightResize"></div>
        <p style="display: none;">{{ this.startTimestamp }} {{ this.endTimestamp }}</p> <!-- for refreshing don't remove-->
    </div>
</template>
<script>
export default {
    props: {
        operation: Object
    },
    data() {
        return {
            dragging: false,
            draggResize: false,
            offsetX: 0,
            posX: 0,
            width: 0,
            posXBeforeResize: 0,
            widthBeforeResize:0,
        }
    },
    mounted() {
        this.posX = this.operation.startPosition;
        this.width = this.operation.width;
    },
    methods: {
        click(event) {
            // if (event.button === 0) {
            //     this.remove();
            // }
        },
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
        },
        onMouseDownRightResize(event) {
            this.draggResize = true;
            this.posXBeforeResize = event.clientX;       
            this.widthBeforeResize = this.width;

            document.addEventListener('mousemove', this.onMouseMoveResize);
            document.addEventListener('mouseup', this.onMouseUpResize);

            this.$store.commit("selectOperation", this.operation.id);
        },
        onMouseMoveResize(event) {
            if (this.draggResize) {
                this.width = this.width + (event.clientX - this.posXBeforeResize);
                this.posXBeforeResize = event.clientX;
            }
        },
        onMouseUpResize() {
            this.draggResize = false;

            const offset = this.width - this.widthBeforeResize;
            this.$store.commit("resizeSelected", {startPosition: this.posX, offset: offset});
            
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUpResize);
        },
        remove() {
            this.$store.commit("deleteOperation", this.operation.id);
        }
    },
    computed: {
        isSelected() {
            return this.$store.getters.isSelected(this.operation.id);
        },
        startTimestamp() {
            return this.$store.state.startTimestamp;
        },
        endTimestamp() {
            return this.$store.state.endTimestamp;
        },
        recentOperation() {
            return this.$store.getters.getOperation(this.operation.id);
        }

    },
    watch: {
        startTimestamp(newVal, oldVal) {
            const op = this.recentOperation;
            this.posX = op.startPosition;
            this.width = op.width;
        },
        endTimestamp(newVal, oldVal) {
            const op = this.recentOperation;
            this.posX = op.startPosition;
            this.width = op.width;
        }
    }
}
</script>
<style scoped>
    .operation {
        display: flex;
        justify-content: center;
        align-items: center;
        /* height: 20px; */
        position: absolute;
        background: red;
        border-radius: 5px;
    }
    .resize {
        cursor: ew-resize;
        position: absolute;
        background: blue;
        height: 100%;
        width: 3px;
        right: 0px;
    }
    .operation-label {
        font-size: xx-small;
        overflow: hidden;
        text-align: center;
        width: 100%;
        height: 100%;
        user-select: none;
    }
    .operation__selected {
        border: 2px solid black;
        background: green;
    }
    .drag {
        width: 20px;
        height: 20px;
        background-image: url('../assets/drag.svg');
        background-size: cover;
        background-position: center;
        cursor: pointer;
    }

</style>