const Consumption = require('./consumtionSim')
const Weather = require('./Weather')

class Simulator {

    // Define all parameters for the simulation in the constructor
    constructor() {
        // Consumption params
        this.minConsumption = 0  //kWh
        this.maxConsumption = 2  // kWh

        // create consumtion simulator
        this.consumption = new Consumption(this.minConsumption, this.maxConsumption)

        // Weather params
        // this.weather = new Weather()    // create weather simulator

    }
    
    //TODO: Create functions for passing data to the database following a timer/ticker.
    getConsumption() {
        return this.consumption.simulateDaily()
    }

    // getWind() {
    //     return this.weather.getWind()
    // }
}

module.exports = Simulator;