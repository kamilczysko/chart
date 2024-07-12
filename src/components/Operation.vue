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
        dragStart(event) {
            this.dragging = true;
            this.dragStartX = event.clientX;
            this.$store.commit("selectOperation", this.id);
            
        },
        move(event) {
            if(this.dragging) {
                this.offsetX = event.clientX - this.dragStartX;
                this.dragStartX = event.clientX;
                console.log(this.dragStartX)
                this.posX = event.clientX;

            }
        },
        dragStop(event) {
            if(this.dragging) {
                this.dragging = false;
                console.log("sex")
                this.$store.commit('addOffsetToOperation', {id:this.id, offset: this.offsetX});
                this.posX = this.operation.startPosition + this.labelsWidth;
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