<template>
    <g @mousedown="dragStart" @mousemove="move" @mouseup="dragStop" @mouseleave=dragStop>
        <rect class="operation" :class="{selected: this.selectedOperation==this.id}" :x="this.posX" :y="this.y" :height="this.defaultHeight" :width="this.width" rx="5" ry="5"></rect>
        <!-- <text :x="this.x + 10" :y="this.y" font-size=".6em" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle">{{ this.name }}</text> -->
    </g>
</template>
<script>
export default {
    props: {
        x: Number,
        y: Number,
        name: String,
        width: Number,
        id: Number
    },
    data(){
        return {
            dragging: false,
            dragStartX: 0,
            posX: 0,
            offsetX:0

        }
    },
    computed: {
        defaultHeight() {
            return this.$store.getters.getDefaultHeight;
        },
        operation() {
            return this.$store.getters.getOperation(this.id)
        },
        labelsWidth() {
            return this.$store.getters.getLabelsWidth;
        },
        selectedOperation() {
            return this.$store.getters.getSelectedOperation;
        }
    },
    mounted() {
        this.posX = this.x;
    },
    methods: {
    
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
        // onMouseDownRightResize(event) {
        //     this.draggResize = true;
        //     this.posXBeforeResize = event.clientX;       
        //     this.widthBeforeResize = this.width;

        //     document.addEventListener('mousemove', this.onMouseMoveResize);
        //     document.addEventListener('mouseup', this.onMouseUpResize);

        //     this.$store.commit("selectOperation", this.operation.id);
        // },
        // onMouseMoveResize(event) {
        //     if (this.draggResize) {
        //         this.width = this.width + (event.clientX - this.posXBeforeResize);
        //         this.posXBeforeResize = event.clientX;
        //     }
        // },
        // onMouseUpResize() {
        //     this.draggResize = false;

        //     const offset = this.width - this.widthBeforeResize;
        //     this.$store.commit("resizeSelected", {startPosition: this.posX, offset: offset});
            
        //     document.removeEventListener('mousemove', this.onMouseMove);
        //     document.removeEventListener('mouseup', this.onMouseUpResize);
        // },
        dragStart(event) {
            this.dragging = true;
            this.offsetX = event.clientX - this.posX;
            
            document.addEventListener('mousemove', this.move);
            document.addEventListener('mouseup', this.stopDrag);

            this.$store.commit("selectOperation", this.id);
            
        },
        move(event) {
            if (this.dragging) {
                this.posX = event.clientX - this.offsetX;
            }
        },
        dragStop(event) {
            if(this.dragging){
                this.dragging = false;
                const offset = this.posX - this.operation.startPosition-this.labelsWidth;

                this.$store.commit('addOffsetToOperation', {id: this.id, offset: offset});
                this.posX = this.operation.startPosition + this.labelsWidth;
                
                document.removeEventListener('mousemove', this.move);
                document.removeEventListener('mouseup', this.drag);
            }
        }
    }
    
}
</script>
<style scoped>
    .operation {
        cursor: pointer;
        
    }
    .operation:hover {
        fill: green;
    }
    .selected {
        fill: pink !important;
    }
</style>