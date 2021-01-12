const Consumption = require('./consumtionSim')
const Weather = require('./Weather')
const Pricing = require('./pricing')

class Simulator {

    constructor() {
        // create simulator components
        this.consumption = new Consumption()
        this.weather = new Weather() 
        this.priceModel = new Pricing()

        // Message to console
        console.log("Simulator system created")
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

    simData() {
        return new Promise((resolve, reject) => {
            var data = {
                "consumption": this.getConsumption(),
                "wind": this.getWind(),
                "suggestedPrice": this.getSuggestedPrice(),
                "date": this.getDate()
            }
            resolve(data)
        }) 
    }

}

module.exports = Simulator;