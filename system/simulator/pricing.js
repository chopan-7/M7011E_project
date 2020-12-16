const {databaseManager} = require("../data-fetcher")


class Pricing {
    
    constructor(){
        this.users = databaseManager.uSettings

        // init price
        this.currentPrice = 0
        this.updatePrice()
    }

    async updatePrice(){
        var demand = 0, supply = 0
        // get sum of all users consumption
        var getDemand = this.users.sumOf("consumption").then( (result) => {
            demand = result['SUM(consumption)']
        })
        

        // get production from users and managers
        var getSupply = this.users.sumOf("production").then( (uProd) => {
            // add user supplies
            supply += uProd['SUM(production)']
        })

        setTimeout( () => {
            // the Price model
            var priceEqulibrium = 10 //price when demand = supply
            var ratio = demand/supply

            this.currentPrice = priceEqulibrium * ratio

        }, 1000)
    }
    
    async suggestedPrice(){
        await this.updatePrice()
        return this.currentPrice
    }
}

module.exports = Pricing;
