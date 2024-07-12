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
            operationHeight: 20,
            nextSectorYPos: 0,

        }
    }
  },
  getters: {
    getSectors:(state) => {
        return state.sectors;
    },
    getStationsForSector:(state) =>  (sectorId) => {
        return state.stations.filter(station => station.sectorId == sectorId)
    },
    getSectorToStations(state) {
        let yPos = 0;
        return state.sectors.map(sector => 
            {
                const stations = state.stations.filter(station => station.sectorId == sector.id);
                const stationData = {
                    sector: sector,
                    yPos: yPos,
                    stations: stations
                } ;
                console.log(yPos)
                yPos += stations.length * state.graphicsParams.operationHeight; //10 - offset
                return stationData;
            }
        )
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
    },
    getGraphicsParams(state) {
        return state.graphicsParams;
    },
    getNextSectorYPos(state) {
        return state.getGraphicsParams.nextSectorYPos;
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
    },
    addNewOperation(state, operation) {
        const ratio = (state.endTimestamp - state.startTimestamp) / state.chartWidthInPX;
        const newOperation  = {
            id: state.chartData.length+1,
            name: "new op #"+state.chartData.length,
            startTimestamp: (operation.startPosition * ratio) + state.startTimestamp,
            duration: 7200000,
            stationId: operation.stationId
        };
        state.chartData.push(newOperation);
    },
    deleteOperation(state, id) {
        state.chartData = state.chartData.filter(data => data.id != id);
    }
  }
})

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);
app.use(store).mount('#app')
