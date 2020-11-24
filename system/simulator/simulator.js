var Consumption = require('./consumtionSim')

class Simulator {

    // Define all parameters for the simulation in the constructor
    constructor() {
        // Consumption param
        this.minConsumtion = 0  //kWh
        this.maxConsumtion = 2  // kWh
        this.consumtion = new Consumption(this.minConsumtion, this.maxConsumtion)
    }
    
    //TODO: Create functions for passing data to the database following a timer/ticker.
}

module.exports = Simulator;