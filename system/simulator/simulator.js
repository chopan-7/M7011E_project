const Consumption = require('./consumtionSim')
const Weather = require('./Weather')
const Pricing = require('./pricing')

class Simulator {

    // Define all parameters for the simulation in the constructor
    constructor() {
        // Consumption params
        this.minConsumption = 0  //kWh
        this.maxConsumption = 2  // kWh

        // create consumtion simulator
        this.consumption = new Consumption(this.minConsumption, this.maxConsumption)

        // Weather params
        this.weather = new Weather()    // create weather simulator
        
        // update daily wind data every 6 seconds
        const updateDaily = setInterval( () => {
            this.weather.getDate()
        }, 6000)

        // Pricing params
        this.priceModel = new Pricing()
    }

    //TODO: Create functions for passing data to the database following a timer/ticker.
    getConsumption() {
        return this.consumption.simulateDaily()
    }

    getWind() {
        return this.weather.getWind()
    }

    getSuggestedPrice() {
        return this.priceModel.suggestedPrice()
    }


}

module.exports = Simulator;