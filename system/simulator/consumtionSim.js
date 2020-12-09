const AppSettings = require('../../appSettings')
const Normal = require('./normaldist')
 
class Consumption {
    // The constructor takes minimum and maxconsumption as parameter
    constructor(){
        this.maxConsumption = AppSettings['simulator']['consumption']['maxConsumption']
        this.minConsumption = AppSettings['simulator']['consumption']['minConsumption']
        console.log(this.maxConsumption)
        console.log(this.minConsumption)
        this.normal = new Normal()
    }

    // simulateDaily returns a list of electricity consumtion over a 24-hour period
    simulateDaily() {
        var dailyConsumtion = new Array(24),
            skew;

        // Generate electricity consumption for each hour.
        // consumption is classified as low, moderate and high depending on time of the day
        for (var i = 0; i < 24; i++) {
            if (i >= 0 && i < 6) { // moderate to low consumtion between 00:00 to 06:00
                skew = 4
                dailyConsumtion[i] = this.normal.randn_bm(this.minConsumption, this.maxConsumption, skew)

            } else if (i >= 6 && i < 12) { // moderate consumption between 06:00 to 12:00
                skew = 3
                dailyConsumtion[i] = this.normal.randn_bm(this.minConsumption, this.maxConsumption, skew)

            } else if (i >= 12 && i < 18) { // moderate to high consumtion between 12:00 to 18:00
                skew = 2
                dailyConsumtion[i] = this.normal.randn_bm(this.minConsumption, this.maxConsumption, skew)

            } else if (i >= 18 && i < 24) { // high consumption between 18:00 to 00:00
                skew = 1
                dailyConsumtion[i] = this.normal.randn_bm(this.minConsumption, this.maxConsumption, skew)
            }
        }

        return dailyConsumtion
    }


}

module.exports = Consumption;
