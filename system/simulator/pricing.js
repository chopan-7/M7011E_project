const AppDao = require("../../api/db/dao")
const UserSettings = require ("../../api/db/UserSettings")
const ManagerSettings = require ("../../api/db/ManagerSettings")


class Pricing {
    
    constructor(){
        this.db = "./api/db/app.db"
        this.dao = new AppDao(this.db)
        this.users = new UserSettings(this.dao)
        this.managers = new ManagerSettings(this.dao)

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
            this.managers.sumOf("production").then( (mProd) => {
                // add manager supplies
                supply += mProd['SUM(production)']
            })
        })

        // setTimeout( () => {
        //     console.log("Demand: "+this.demand)
        //     console.log("Supply: "+this.supply)
        // }, 1000)

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
