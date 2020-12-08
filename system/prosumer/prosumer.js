const AppDao = require("../../api/db/dao")
const Users = require("../../api/db/Users")
const UserSettings = require("../../api/db/UserSettings")
const fetch = require("node-fetch")

class Prosumer {

    constructor(){
        // connect to db
        this.dao = new AppDao("./api/db/app.db")
        this.users = new Users(this.dao)
        this.uSettings = new UserSettings(this.dao)
        
        // simulation parameters
        this.ticks = 0;
        setInterval( () =>{
            console.log(this.ticks)
            this.ticks += 1
        }, 10000)

        // wind turbine paramenters
        this.turbine = 2 // kW (electricity production constant)
        
        // prosumer list and data
        this.prosumerList = new Array() // prosumer container [{"id": 2, "name": "prosumer1"}]
        this.prosumerData = new Array() // prosumer data container [{"id": 1, "consumptions": [0.3, 0.4,...0.7], "wind": [0.2, 0.6, 3.0,..., 4.0]}]

        this.getProsumerList()
        setTimeout( () => {
            console.log(this.prosumerList)
            this.fetchAllData()
        }, 1000)
        setTimeout( () => {
            console.log(this.prosumerData)
        }, 2000) 
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
            var data = fetch('http://localhost:3000/simulator',{
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
                        "id": pro['id'],
                        "consumption": data['data']['simulate']['getConsumption'],
                        "wind": data['data']['simulate']['getWind']
                    }
                )

            })
        })
    }

    //TODO: create production function hej
    production(wind) {
        pi = Math.PI
        r = 58          //radius of turbine
        v = wind        // wind velocity m/s
        effi = 0.4      //efficeny %
        dens = 1.2      //air density 
        power = (pi/2 * v**3 * r**2 * dens * effi)/1000 //(power of turbine: P = π/2 * r² * v³ * ρ * η) in KW
        return power
    }

    // TODO: buy_ratio function
    // ...
    buy_ratio(buy){ //buy in %
        buffer_ratio = 1-buy

    }

    // TODO: sell_ratio function
    // ...
    sell_ratio(sell){
        buffer_ratio = 1 - sell
    }

    // TODO: add electricity to buffer
    addToBuffer(value) {

    }

    // TODO: drain electricity from buffer
    drainBuffer(value) {

    }

}

module.exports = Prosumer;

var main = () => {
    var pro = new Prosumer()
}

main()