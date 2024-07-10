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
                id: 1,
                name: "drill",
                startTimestamp: 1720537860000,
                duration: 7200000,
                stationId: 1
            },{
                id: 2,
                name: "mill",
                startTimestamp: 1721404680000,
                duration: 2600000,
                stationId: 1
            },{
                id: 3,
                name: "weld",
                startTimestamp: 1720476000000,
                duration: 3600000,
                stationId: 1
            },{
                id: 4,
                name: "packing",
                startTimestamp: 1720537860000,
                duration: 7400000,
                stationId: 3
            }
        ],
        sectors: [
            {
                id: 1,
                name: "hala A"
            },{
                id: 2,
                name: "hala B"
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
                id: 3,
                name: "packing station",
                responsible: "Janusz",
                sectorId: 2
            }
        ],
        startTimestamp: new Date().getTime(),
        endTimestamp: new Date().getTime() + 86400,
        chartWidthInPX: 0,
        selectedOperation: null,
        targetStation: null,
    }
  },
  getters: {
    getSectors:(state) => {
        return state.sectors;
    },
    getStationsForSector:(state) =>  (sectorId) => {
        return state.stations.filter(station => station.sectorId == sectorId)
    },
    getOperations : (state) => (station) => {
        const ratio = state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);
        const convertToDisplayable = (data, ratio) => {
            const displayableData = { ...data};
            displayableData.startPosition = ratio * (data.startTimestamp - state.startTimestamp);
            displayableData.width = ratio * data.duration;
            return displayableData;
        };

        return state.chartData
                .filter(data => data.stationId == station 
                    && data.startTimestamp >= state.startTimestamp - 100
                    && data.startTimestamp < state.endTimestamp 
                )
                .map(data => convertToDisplayable(data, ratio));
    },
    getOperation: (state) =>  (id) => {
        const ratio = state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);
        const convertToDisplayable = (data, ratio) => {
            const displayableData = { ...data};
            displayableData.startPosition = ratio * (data.startTimestamp - state.startTimestamp);
            displayableData.width = ratio * data.duration;
            return displayableData;
        };

        const d = state.chartData.filter(data => data.id == id)[0];
        return convertToDisplayable(d, ratio);
    },
    getTimestamps:(state) => {
        return {
            start: state.startTimestamp,
            end: state.endTimestamp
        }
    },
    isSelected:(state) => (id) => {
        return state.selectedOperation == id;
    },
    getPXToTimeRatio(state) {
        return state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);
    }
  },
  mutations: {
    setChartWidth(state, width) {
        state.chartWidthInPX = width;
    },
    setStartTimestamp(state, timestamp) {
        state.startTimestamp = timestamp;
    },
    setEndTimestamp(state, timestamp) {
        state.endTimestamp = timestamp;
    },
    selectOperation(state, id) {
        state.selectedOperation = id;
    },    
    moveSelected(state, offset) {
        const operation = state.chartData.filter(data => data.id == state.selectedOperation)[0]
        const ratio = (state.endTimestamp - state.startTimestamp) / state.chartWidthInPX;
        operation.startTimestamp = (offset * ratio) + operation.startTimestamp;
    },
    resizeSelected(state, data) {
        const operation = state.chartData.filter(data => data.id == state.selectedOperation)[0]
        const ratio = (state.endTimestamp - state.startTimestamp) / state.chartWidthInPX;
        operation.duration = (data.offset * ratio) + operation.duration;
        operation.startTimestamp = (data.startPosition * ratio) + state.startTimestamp;
    },
    setTargetStation(state, station) {
        state.targetStation = station;
    },
    changeStation(state) {
        state.chartData.filter(data => data.id == state.selectedOperation)[0].stationId = state.targetStation;        
    }
  }
})

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);
app.use(store).mount('#app')
