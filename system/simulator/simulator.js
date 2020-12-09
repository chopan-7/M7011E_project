const Consumption = require('./consumtionSim')
const Weather = require('./Weather')
const Pricing = require('./pricing')

class Simulator {

    constructor() {
        // create simulator components
        this.consumption = new Consumption()
        this.weather = new Weather() 
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

    getDate(){
        return this.weather.date
    }

}

module.exports = Simulator;