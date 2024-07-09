// import './style.css'
import { createApp } from 'vue'
import App from './App.vue'

import { createStore } from 'vuex'

import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css'

const store = createStore({
  state () {
    return {
        chartData: [
            {
                id: 1,
                name: "drill",
                startTimestamp: 1720537860000,
                duration: 7200,
                stationId: 1
            },{
                id: 2,
                name: "mill",
                startTimestamp: 1721404680000,
                duration: 2600,
                stationId: 1
            },{
                id: 3,
                name: "weld",
                startTimestamp: 1720537860000,
                duration: 3600,
                stationId: 2
            }
        ],
        sectors: [
            {
                id: 1,
                name: "hala A"
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
                name: "drilling station",
                responsible: "Adam",
                sectorId: 1
            }
        ],
        startTimestamp: new Date().getTime(),
        endTimestamp: new Date().getTime() + 86400,
        chartWidthInPX: 0
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
        const convertToDisplayable = (data, ratio) => {
            const displayableData = { ...data};
            displayableData.startPosition = ratio * data.startTimestamp;
            displayableData.width = ratio * data.duration;
            return displayableData;
        };

        const ratio = state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);
        return state.chartData
                .filter(data => data.stationId == station 
                    && data.startTimestamp >= state.startTimestamp 
                    && data.startTimestamp < state.endTimestamp
                )
                .map(data => convertToDisplayable(data, ratio));
    },
    getTimestamps:(state) => {
        return {
            start: state.startTimestamp,
            end: state.endTimestamp
        }
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
    }
    
  }
})

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);
app.use(store).mount('#app')
