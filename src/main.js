import './style.css'
import { createApp } from 'vue'
import App from './App.vue'

import { createStore } from 'vuex'

import VueDatePicker from '@vuepic/vue-datepicker';

const store = createStore({
  state () {
    return {
        chartData: [
            {
                id: 4,
                name: "drill",
                startTimestamp: 1720537860000,
                duration: 7200000,
                stationId: 1
            },{
                id: 3,
                name: "weld",
                startTimestamp: 1720486000000,
                duration: 3600000,
                stationId: 2
            },
            {
                id: 1,
                name: "drill",
                startTimestamp: 1720537860000,
                duration: 7200000,
                stationId: 3
            },{
                id: 2,
                name: "weld",
                startTimestamp: 1720476000000,
                duration: 3600000,
                stationId: 1
            }
        ],
        sectors: [
            {
                id: 1,
                name: "hala A"
            },{
                id: 2,
                name: "hala B"
            },
            {
                id: 3,
                name: "hala C"
            },{
                id: 4,
                name: "hala D"
            }
        ], 
        stations: [
            {
                id: 1,
                name: "drilling station",
                responsible: "Adam",
                sectorId: 1
            },
            {
                id: 2,
                name: "welding station",
                responsible: "Adam",
                sectorId: 1
            },
            {
                id: 4,
                name: "qa",
                responsible: "pczemek",
                sectorId: 1
            },
            {
                id: 3,
                name: "packing station",
                responsible: "Janusz",
                sectorId: 2
            },
            {
                id: 5,
                name: "qa sation 2",
                responsible: "Janusz",
                sectorId: 2
            },
            {
                id: 11,
                name: "drilling station",
                responsible: "Adam",
                sectorId: 3
            },
            {
                id: 22,
                name: "welding station",
                responsible: "Adam",
                sectorId: 3
            },
            {
                id: 44,
                name: "qa",
                responsible: "pczemek",
                sectorId: 3
            },
            {
                id: 33,
                name: "packing station",
                responsible: "Janusz",
                sectorId: 3
            },
            {
                id: 55,
                name: "qa sation 2",
                responsible: "Janusz",
                sectorId: 3
            }
        ],
        startTimestamp: new Date().getTime(),
        endTimestamp: new Date().getTime() + 86400,
        chartWidthInPX: 0,
        selectedOperation: null,
        targetStation: null,
        graphicsParams: {
            defaultHeight: 20,
            nextSectorYPos: 0,
            labelsWidth: 200,
        },
        selectedOperation: null,
        targetStationId: null,
    }
  },
  getters: {
    getSectorToStation(state) {
        let nextYPos = 0;
        const items = state.sectors.map(sector => {
            const stations = state.stations.filter(station => station.sectorId == sector.id);
            const data = {
                sector: sector,
                stations: stations,
                yPos: nextYPos
            };
            nextYPos += state.graphicsParams.defaultHeight * stations.length;
            return data
        });
        return items;
    },
    getDefaultHeight(state) {
        return state.graphicsParams.defaultHeight;
    },
    getLabelsWidth(state) {
        return state.graphicsParams.labelsWidth;
    },
    getOperations : (state) => {
        return state.chartData
                .filter(data => data.startTimestamp >= state.startTimestamp - 100
                    && data.startTimestamp < state.endTimestamp)
                .map(data => {return {id:data.id, stationId:data.stationId};});
    },
    getOperation :(state) => (id) => {
        const ratio = state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);
        const convertToDisplayable = (data, ratio) => {
            const displayableData = { ...data};
            displayableData.startPosition = ratio * (data.startTimestamp - state.startTimestamp);
            displayableData.width = ratio * data.duration;
            return displayableData;
        };
        const dataToChange = state.chartData.filter(data => data.id == id)[0];
        return convertToDisplayable(dataToChange, ratio);
    },
    getTimestamps(state) {
        return {
            start: state.startTimestamp,
            end: state.endTimestamp
        }
    },
    getStartTimestamp(state) {
        return state.startTimestamp;
    },
    getEndTimestamp(state) {
        return state.endTimestamp;
    },
    getTimeToPXRatio(state) {
        return (state.endTimestamp - state.startTimestamp) / state.chartWidthInPX;
    },
    getSelectedOperation(state) {
        return state.selectedOperation;
    }

    
  },
  mutations: {
    setChartWidth(state, width) {
        state.chartWidthInPX = width-state.graphicsParams.labelsWidth;
    },
    setStartTimestamp(state, timestamp) {
        state.startTimestamp = timestamp;
    },
    setEndTimestamp(state, timestamp) {
        state.endTimestamp = timestamp;
    },
    addOffsetToOperation(state, data) {
        const operationToMod = state.chartData.filter(cd => cd.id == data.id)[0];
        const ratio = (state.endTimestamp - state.startTimestamp) / state.chartWidthInPX;
        const timeOffset = data.offset * ratio;
        operationToMod.startTimestamp += Math.floor(timeOffset);
    },
    setWidthToOperation(state, data) {
        const operationToMod = state.chartData.filter(cd => cd.id == data.id)[0];
        const ratio = (state.endTimestamp - state.startTimestamp) / state.chartWidthInPX;

        const timeOffset = data.offset * ratio;
        operationToMod.duration += Math.floor(timeOffset);
    },
    selectOperation(state, id) {
        state.selectedOperation = id;
    },
    addNewOperation(state, data) {
        const ratio = (state.endTimestamp - state.startTimestamp) / state.chartWidthInPX;
        const startTimestamp = Math.floor(data.x * ratio) + state.startTimestamp;
        
        const id = state.chartData.length + 1;

        const newOperation = {
            id: id,
            name: "new OP #" + id,
            startTimestamp: startTimestamp,
            duration: 7200000,
            stationId: data.station
        };
        state.chartData.push(newOperation);
    },
    updateOperationsStation(state) {
        if(state.selectedOperation == null || state.targetStationId == null) {
            return;
        }
        
        state.chartData.filter(d => d.id == state.selectedOperation)[0].stationId = state.targetStationId;
        state.targetStationId = null;
    },
    updateTargetStationId(state, stationId) {
        state.targetStationId = stationId;
    },
    remove(state, id) {
        state.chartData = state.chartData.filter(d => d.id != id);
    }
    
}
})

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);
app.use(store).mount('#app')
