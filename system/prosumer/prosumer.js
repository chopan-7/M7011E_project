const AppSettings = require("../../appSettings")
const AppDao = require("../../api/db/dao")
const Users = require("../../api/db/Users")
const UserSettings = require("../../api/db/UserSettings")
const fetch = require("node-fetch")

class Prosumer {

    constructor(){
        // connect to db
        this.dao = new AppDao(AppSettings.database)
        this.users = new Users(this.dao)
        this.uSettings = new UserSettings(this.dao)

        // wind turbine paramenters
        this.turbine = 2 // kW (electricity production constant)
        
        // prosumer list and data
        this.prosumerList = new Array() // prosumer container [{"id": 2, "name": "prosumer1"}]
        this.prosumerData = new Array() // prosumer data container [{"id": 1, "consumptions": [0.3, 0.4,...0.7], "wind": [0.2, 0.6, 3.0,..., 4.0]}]

        // Populate the prosumer list and start the production
        this.getProsumerList()
        setTimeout( () => {
            this.fetchAllData()
        }, 1000)
        setTimeout( () => {
            this.startProduction()
        }, 3000) 


        // Simulation event-loop
        this.ticks = 0; //ticks every hour (10 sec)
        setInterval( () =>{
            if (this.ticks == 23) {
                this.ticks = 0
            } else {
                this.ticks += 1
            }
            this.startProduction()  // recalculate the production for each prosumer
        }, AppSettings.simulator.duration.hour)

    }

    // populate prosumerlist from database
    async getProsumerList(){
        var prosumers = await this.users.getWhere("id, name", "role=2").then( (res) => {
            res.forEach(pro => {
                this.prosumerList.push(pro)
            });
        })
    }

    // fetch data from simulator API and update the prosumerData list
    async fetchAllData(){
        // clear current prosumerData list
        this.prosumerData = new Array()

        // update prosumerData list with new data from API
        this.prosumerList.forEach(pro => {
            var query = `query Simulator {
                    simulate {
                      getConsumption
                      getWind
                    }
                }`
            var data = fetch(AppSettings.server+'/api/simulator',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query
                })
            })
            .then( (res) => res.json())
            .then( (data) => {
                // structure of returned data: data['data']['simulate']['getWind']
                this.prosumerData.push(
                    {
                        "id": pro.id,
                        "consumption": data.data.simulate.getConsumption,
                        "wind": data.data.simulate.getWind
                    }
                )

            })
        })
    }

    // produce electricity periodically for every prosumer in the grid
    // and save the production and consumption data to database
    startProduction() {
        this.prosumerList.forEach((prosumer, index) => {
            var production = this.turbineGenerator(this.prosumerData[index]['wind'][this.ticks])
            this.uSettings.updateProduction(prosumer['id'], production)
            this.uSettings.updateConsumption(prosumer['id'], this.prosumerData[index]['consumption'][this.ticks])
        })
    }

    //TODO: create production function
    turbineGenerator(wind) {
        var pi = Math.PI
        var r = 58          //radius of turbine
        var v = wind        // wind velocity m/s
        var effi = 0.4      //efficeny %
        var dens = 1.2      //air density 
        var power = (pi/2 * v**3 * r**2 * dens * effi)/1000 //(power of turbine: P = π/2 * r² * v³ * ρ * η) in KW
        return power
    }

    // TODO: update the value of toGrid to ManagerSettings
    addToBuffer(id) {
        // data
        var prosumerdata = this.prosumerData.find(obj => obj.id == id)
        var production = this.turbineGenerator(prosumerdata.wind[this.ticks])
        // get ratio from db
        this.uSettings.getWhere("sell_ratio, buffer", "user_id="+id)
        .then((res) => {
            prosumerdata.sell_ratio = res.sell_ratio
            prosumerdata.buffer = res.buffer
        })

        // calculations
        setTimeout( () => {
            var toGrid =  production*prosumerdata.sell_ratio  // sell amount to the grid
            var toBuffer = production - toGrid             // store amount to buffer
            console.log("Electricity to the buffer: "+toBuffer)
            console.log("Electricity to the grid: "+ toGrid)

            // add to buffer, if amout > cap, set buffer = cap
            if(prosumerdata.buffer + toBuffer < AppSettings.prosumer.bufferCap ) {
                this.uSettings.updateBuffer(id, prosumerdata.buffer + toBuffer)
                console.log("Left in buffer: "+(prosumerdata.buffer + toBuffer))
            } else {
                this.uSettings.updateBuffer(id, AppSettings.prosumer.bufferCap)
                console.log("Buffer is full!")
            }

        }, 100)
    }

    // TODO: update value of fromGrid to ManagerSettings
    drainBuffer(id) {
        // data
        var prosumerdata = this.prosumerData.find(obj => obj.id == id)
        var consumption = prosumerdata.consumption[this.ticks]
        // get ratio from db
        this.uSettings.getWhere("buy_ratio, buffer", "user_id="+id)
        .then((res) => {
            prosumerdata.buy_ratio = res.buy_ratio
            prosumerdata.buffer = res.buffer
        })

        // calculations
        setTimeout( () => {
            var fromGrid =  consumption*prosumerdata.buy_ratio  // buy amount from the grid
            var fromBuffer = consumption-fromGrid               // drain amount from buffer
            console.log("Electricity needed from buffer "+fromBuffer)

            // drain from buffer, if drain amount > buffer, set buffer to zero
            if(prosumerdata.buffer > fromBuffer) {
                this.uSettings.updateBuffer(id, (prosumerdata.buffer-fromBuffer))
                console.log("Left in buffer: "+(prosumerdata.buffer-fromBuffer))
            } else {
                this.uSettings.updateBuffer(id, prosumerdata.buffer-prosumerdata.buffer)
                console.log("Buffer empty!")
            }

        }, 100)
    }

    // API functions
    getData(id) {
        var prosumerdata = this.prosumerData.find(obj => obj.id == id)
        return {
            "id": prosumerdata.id,
            "production": this.turbineGenerator(prosumerdata.wind[this.ticks]),
            "consumption": prosumerdata.consumption[this.ticks],
            "wind": prosumerdata.wind[this.ticks]
        }
    }

    setBufferRatio(data){
        data = JSON.parse(JSON.stringify(data)) // data = {id, input {buy, selll}}
        var msg;

        // check if user exist
        var checkUser = this.users.getById(data.id)
        .then((res) => {
            if(res == undefined){
                msg ="No user with id: "+data.id
                console.log(msg)
            } else {
                this.uSettings.updateBuyRatio(data.id, data.input.buy)
                this.uSettings.updateSellRatio(data.id, data.input.sell)
            }
        })
        .catch((err) => {
            console.log(err)
        })
        return {id: data.id, buy: data.input.buy, sell: data.input.sell}
    }
}

module.exports = Prosumer;

// const main = () => {
//     var pro = new Prosumer()

//     setTimeout(() => {
//         pro.addToBuffer(144)
//     }, 1500)

// }

// main()