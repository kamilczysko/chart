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
                id: 3,
                name: "weld",
                startTimestamp: 1720476000000,
                duration: 3600000,
                stationId: 1
            },{
                id: 1,
                name: "drill",
                startTimestamp: 1720537860000,
                duration: 7200000,
                stationId: 4
            },{
                id: 3,
                name: "weld",
                startTimestamp: 1720476000000,
                duration: 3600000,
                stationId: 4
            },{
                id: 2,
                name: "mill",
                startTimestamp: 1721404680000,
                duration: 2600000,
                stationId: 2
            },{
                id: 4,
                name: "packing",
                startTimestamp: 1721404700000,
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
        }
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
        const ratio = state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);
        const convertToDisplayable = (data, ratio) => {
            const displayableData = { ...data};
            displayableData.startPosition = ratio * (data.startTimestamp - state.startTimestamp);
            displayableData.width = ratio * data.duration;
            return displayableData;
        };

        return state.chartData
                .filter(data => data.startTimestamp >= state.startTimestamp - 100
                    && data.startTimestamp < state.endTimestamp 
                )
                .map(data => convertToDisplayable(data, ratio));
    },
    getOperation : (state) => (id) => {
        const ratio = state.chartWidthInPX / (state.endTimestamp - state.startTimestamp);
        const convertToDisplayable = (data, ratio) => {
            const displayableData = { ...data};
            displayableData.startPosition = ratio * (data.startTimestamp - state.startTimestamp);
            displayableData.width = ratio * data.duration;
            return displayableData;
        };

        return state.chartData
                .filter(data => data.id == id)
                .map(data => convertToDisplayable(data, ratio));
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
    
  }
})

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);
app.use(store).mount('#app')
