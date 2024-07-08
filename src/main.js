// import './style.css'
import { createApp } from 'vue'
import App from './App.vue'

import { createStore } from 'vuex'

const store = createStore({
  state () {
    return {
        chartData: [
            {
                id: 1,
                name: "drill",
                startTimestamp: 123,
                duration: 4234,
                stationId: 1
            },{
                id: 2,
                name: "mill",
                startTimestamp: 123,
                duration: 4234,
                stationId: 1
            },{
                id: 3,
                name: "weld",
                startTimestamp: 123,
                duration: 4234,
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
        startTimestamp: 1,
        endTimestamp: 2,
        chartWidthInPX: 0
    }
  },
  getters: {
    getSectors(state) {
        return state.sectors;
    },
    getStationsForSector(state, sectorId) {
        return state.stations.filter(station => station.sectorId == sectorId)
    },
    getOperations(state, station, startTimestamp, endTimestamp) {
        const convertToDisplayable = (data, ratio) => {
            const displayableData = { ...data};
            displayableData.startPosition = ratio * data.startTimestamp;
            displayableData.width = ratio * data.duration;
            return displayableData;
        };

        const ratio = state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);

        return state.chartData
                .filter(data => data.stationId == station 
                    && data.startTimestamp >= startTimestamp 
                    && data.endTimestamp <= endTimestamp)
                .map(data => convertToDisplayable(data, ratio));
    },
    getTimestamps(state) {
        return {
            start: state.startTimestamp,
            end: state.endTimestamp
        }
    }
  },
  mutations: {
    setChartWidth(state, width) {
        state.chartWidthInPX = width;
    }
  }
})

const app = createApp(App)

app.use(store).mount('#app')
