<template>
    <div class="operation"  :style="{ width: this.width + 'px', left: this.posX + 'px'}"> 
        <p class="operation-label"
        :class="{operation__selected : this.isSelected }"
        @mousedown="this.onMouseDown">
        {{this.operation.name}}
        </p>
        <div class="resize right" @mousedown="this.onMouseDownRightResize"></div>
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
            draggRightResize: false,
            offsetX: 0,
            posX: 0,
            resizePosX: 0,
            width: 0,
            widthBefore:0,
        }
    },
    mounted() {
        this.posX = this.operation.startPosition;
        this.width = this.operation.width;
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
        onMouseDownRightResize(event) {
            this.draggRightResize = true;
            this.resizePosX = event.clientX;       
            this.widthBefore = this.width;

            document.addEventListener('mousemove', this.onMouseMoveResize);
            document.addEventListener('mouseup', this.onMouseUpResize);

            this.$store.commit("selectOperation", this.operation.id);
        },
        onMouseMove(event) {
            if (this.dragging) {
                this.posX = event.clientX - this.offsetX;
            }
        },
        onMouseMoveResize(event) {
            if (this.draggRightResize) {
                this.width = this.width + (event.clientX - this.resizePosX);
                this.resizePosX = event.clientX;
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
        onMouseUpResize() {
            this.draggRightResize = false;

            const offset = this.width - this.widthBefore;
            this.$store.commit("resizeSelected", {startPosition: this.posX, offset: offset});
            
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUpResize);
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
        display: flex;
        justify-content: center;
        justify-content: space-around;
        /* height: 20px; */
        position: relative;
        background: red;
        border-radius: 5px;
    }
    .resize {
        cursor: ew-resize;
        position: absolute;
        background: green;
        height: 100%;
        width: 3px;
        right: 0px;
    }
    .operation-label {
        font-size: xx-small;
        cursor: pointer;
        border: 1px solid black;
        overflow: hidden;
    }
    .operation-label:hover {
        background: rgb(131, 0, 0);
    }

    .operation__selected {
        border: 2px solid black;
        background: green;
    }

</style>