<template>
    <g>
        <rect class="operation"
        @mousedown="dragStart" @mousemove="move" @mouseup="dragStop" @mouseleave=dragStop
        :class="{selected: this.selectedOperation==this.id}" :x="this.posX" :y="this.y" :height="this.defaultHeight" :width="this.wdth" rx="5" ry="5"></rect>
        <rect 
        @mousedown="resizeStart" @mousemove="resize" @mouseup="resizeStop" @mouseleave=resizeStop
        :x="this.posX+this.wdth" :y="this.y" fill="red" :height="this.defaultHeight" :width="4" class="resize"></rect>
        <!-- <text :x="this.x + 10" :y="this.y" font-size=".6em" :dy="this.defaultHeight / 2" :height="this.defaultHeight" dominant-baseline="middle">{{ this.name }}</text> -->
         <p style="display: none;">{{this.startTimestamp}} {{this.endTimestamp}}</p>
    </g>
</template>
<script>
export default {
    props: {
        y: Number,
        name: String,
        id: Number
    },
    data(){
        return {
            // operation: null, 

            dragging: false,
            dragStartX: 0,
            
            wdth: 0,
            posX: 0,
            offsetX:0,

            resizing: false,
            posXResize: 0,
            offsetXResize: 0
        }
    },
    computed: {
        defaultHeight() {
            return this.$store.getters.getDefaultHeight;
        },
        recentOperation() {
            return this.$store.getters.getOperation(this.id)
        },
        labelsWidth() {
            return this.$store.getters.getLabelsWidth;
        },
        selectedOperation() {
            return this.$store.getters.getSelectedOperation;
        },
        startTimestamp() {
            return this.$store.getters.getStartTimestamp;
        },
        endTimestamp() {
            return this.$store.getters.getEndTimestamp;
        },
    },
    mounted() {
        this.posX = this.recentOperation.startPosition + this.labelsWidth;
        this.wdth = this.recentOperation.width;
    },
    watch: {
        startTimestamp(oldVal, newVal) {
            this.posX = this.recentOperation.startPosition + this.labelsWidth;
            this.wdth = this.recentOperation.width;
        },
        endTimestamp(oldVal, newVal) {
            this.posX = this.recentOperation.startPosition + this.labelsWidth;
            this.wdth = this.recentOperation.width;
        }
    },
    methods: {
        resizeStart(event) {
            this.resizing = true;
            this.offsetXResize = event.clientX;// - this.posX;
            
            document.addEventListener('mousemove', this.resize);
            document.addEventListener('mouseup', this.stopResize);

            this.$store.commit("selectOperation", this.id);
        },
        resize(event) {
            if(this.resizing){
                this.posXResize = event.clientX - this.offsetXResize;
                this.wdth += this.posXResize;
                this.offsetXResize = event.clientX;
            }
        },
        stopResize(event) {
            if(this.resizing){
                this.resizing = false;
                const offset = this.wdth - this.recentOperation.width;

                this.$store.commit('setWidthToOperation', {id: this.id, offset: offset});
                this.wdth = this.recentOperation.width;
                
                document.removeEventListener('mousemove', this.move);
                document.removeEventListener('mouseup', this.drag);
            }
        },
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
                const offset = this.posX - this.recentOperation.startPosition-this.labelsWidth;

                this.$store.commit('addOffsetToOperation', {id: this.id, offset: offset});
                this.posX = this.recentOperation.startPosition + this.labelsWidth;
                
                document.removeEventListener('mousemove', this.move);
                document.removeEventListener('mouseup', this.drag);
            }
        }
    }
    
}
</script>
<style scoped>
    .operation {
        cursor: grab;
        
    }
    .operation:hover {
        fill: green;
    }
    .selected {
        fill: pink !important;
    }
    .resize {
        cursor: ew-resize ; 
    }
    .resize:hover {
        fill: green;
    }
</style>