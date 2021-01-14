const AppSettings = require("../../appSettings")
const { databaseManager } = require("../data-fetcher")
const { fetchFromSim, fetchFromMan } = require("../data-fetcher")
const jwt = require('jsonwebtoken')

class Prosumer {

    constructor(){
        // connect to db
        this.users = databaseManager.users
        this.uSettings = databaseManager.uSettings

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

        // Message to console
        console.log("Prosumer system created")

    }

    /* ------------------------------- USER FUNCTIONS BEGIN ----------------------------- */
    authenticate(email, password) {
        return new Promise((resolve, reject) => {
            var role = AppSettings.database.roles.indexOf("prosumer")
            this.users.userAuth(email, password, role).then((auth) => {
                var res = {"status": undefined, "message": undefined, "tokens": undefined}
                if(auth[0]) {
                    // create access-token and refresh-token
                    var accessToken = jwt.sign(
                        {"userid": auth[1].id},
                        AppSettings.secrets.access,
                        {expiresIn: '24h'})
                    
                    var refreshToken = jwt.sign(
                        {"userid": auth[1].id},
                        AppSettings.secrets.refresh,
                        {expiresIn: '7d'})

                    res.tokens = {"access":accessToken, "refresh":refreshToken}
                    res.status = true
                    res.message = "Welcome!"

                } else {
                    res.status = false
                    res.message = "Wrong email or password."
                }
                resolve(res)
            })
        })
    }

    isAuthenticated(id){
        return new Promise((resolve, reject) => {
            var checkUser = this.users.getWhere("id, online", "id="+id)
            checkUser.then((user) => {
                if(user[0].online == 1) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    signOut(id) {
        return this.users.signOut(id)
    }

    /* ------------------------------- USER FUNCTINOS END ---------------------------------- */

    /* ------------------------------- CORE FUNCTIONS START -------------------------------- */
    // populate prosumerlist from database
    async getProsumerList(){
        var role = AppSettings.database.roles.indexOf("prosumer")
        var prosumers = await this.users.getWhere("id, name", "role="+role).then( (res) => {
            res.forEach(pro => {
                this.prosumerList.push(pro)
            });
        })
    }

    // fetch data from simulator API and update the prosumerData list
    fetchAllData(){
        // clear current prosumerData list
        this.prosumerData = new Array()
        var query = `query { 
            simulate {
                consumption
                wind
            }
                
        }`

        this.prosumerList.forEach( pro => {
            fetchFromSim(query).then( (data) => {
                // structure of returned data: data['data']['simulate']['getWind']
                this.prosumerData.push(
                    {
                        "id": pro.id,
                        "consumption": data.data.simulate.consumption,
                        "wind": data.data.simulate.wind
                    }
                )
            })
        })
    }

    /* Produce electricity periodically for every prosumer in the grid
    and save the production and consumption data to database.
    In case of excessive or under production, redirect the electricity
    according to the set ratios. */
    startProduction() {
        this.prosumerList.forEach((prosumer, index) => {
            var production = this.turbineGenerator(this.prosumerData[index]['wind'][this.ticks])
            var consumption = this.prosumerData[index].consumption[this.ticks]
            var netProduction

            if (production > consumption){  // Case 1: Excessive production
                netProduction = production-consumption
                this.addToBuffer(prosumer.id, netProduction)
            } else {                  
                netProduction = consumption-production      // Case 2: Under-production
                this.drainBuffer(prosumer.id, netProduction)
            }

            // update prosumer database
            this.uSettings.updateProduction(prosumer['id'], production)
            this.uSettings.updateConsumption(prosumer['id'], this.prosumerData[index]['consumption'][this.ticks])
            this.uSettings.getWhere("state", "user_id="+prosumer.id).then((p) => {
                var currentState = p.state
                // change state to outtage of consumption > production+buffer
                if(consumption > (production+this.prosumerData[index].buffer)) {
                    this.uSettings.updateState(prosumer.id, AppSettings.database.roles.indexOf("outage"))
                } else {
                    // change state from to running if idle or outage
                    if(currentState == (AppSettings.database.states.indexOf("idle"))) {
                        this.uSettings.updateState(prosumer.id, AppSettings.database.states.indexOf("producing"))
                    }
                }
            })
        })
    }

    turbineGenerator(wind) {
        var pi = Math.PI
        var r = 58          //radius of turbine
        var v = wind        // wind velocity m/s
        var effi = 0.4      //efficeny %
        var dens = 1.2      //air density 
        var power = (pi/2 * v**3 * r**2 * dens * effi)/1000 //(power of turbine: P = π/2 * r² * v³ * ρ * η) in KW
        return power
    }

    addToBuffer(id, production) {
        // data
        var prosumerdata = async () => await this.prosumerData.find(obj => obj.id == id)

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
            //console.log("Electricity to the buffer: "+toBuffer)
            //console.log("Electricity to the grid: "+ toGrid)

            // add to buffer, if amout > cap, set buffer = cap
            if(prosumerdata.buffer + toBuffer < AppSettings.prosumer.bufferCap ) {
                this.uSettings.updateBuffer(id, prosumerdata.buffer + toBuffer)
                //console.log("Left in buffer: "+(prosumerdata.buffer + toBuffer))
            } else {
                // fill the buffer and add excess production to griod
                toGrid += (prosumerdata.buffer+toBuffer-AppSettings.prosumer.bufferCap)
                this.uSettings.updateBuffer(id, AppSettings.prosumer.bufferCap)
                //console.log("Buffer is full!")
            }

            // add to Market via API
            var accessToken = jwt.sign(
                {userid: id},
                AppSettings.secrets.access,
                {expiresIn: '1min'})
            var mutation = `mutation {
                addToMarket(id: ${id}, amount: ${toGrid}, input: {access: "${accessToken}"})
            }`
            fetchFromMan(mutation)

        }, 100)
    }

    drainBuffer(id, consumption) {
        // data
        var prosumerdata = async () => await this.prosumerData.find(obj => obj.id == id)
        
        // get ratio from db
        this.uSettings.getWhere("buy_ratio, buffer", "user_id="+id)
        .then((res) => {            
            prosumerdata.buy_ratio = res.buy_ratio
            prosumerdata.buffer = res.buffer

        })
        
        // calculations
        setTimeout( () => {
            var fromGrid =  consumption*prosumerdata.buy_ratio  // buy amount from the grid

            // drain from Market via API
            var accessToken = jwt.sign(
                {userid: id},
                AppSettings.secrets.access,
                {expiresIn: '1min'})
            var mutation = `mutation {
                drainMarket(id: ${id}, amount: ${fromGrid}, input: {access: "${accessToken}"}) {
                    status
                    fromMarket
                }
            }`
            fetchFromMan(mutation).then( (response) => {
                var data = response.data.drainMarket
                // if success from market
                if(data.status){
                    var fromBuffer = consumption-data.fromMarket               // drain amount from buffer
                    //console.log("Electricity needed from buffer "+fromBuffer)
        
                    // drain from buffer, if drain amount > buffer, set buffer to zero
                    if(prosumerdata.buffer > fromBuffer) {
                        this.uSettings.updateBuffer(id, (prosumerdata.buffer-fromBuffer))
                        //console.log("Left in buffer: "+(prosumerdata.buffer-fromBuffer))
                    } else {
                        this.uSettings.updateBuffer(id, prosumerdata.buffer-prosumerdata.buffer)
                        //console.log("Buffer empty!")
                    }
                }
            })

        }, 1000)
    }
    /* ------------------------------- CORE FUNCTIONS END ------------------------------- */

    /* ------------------------------- API FUNCTIONS START ------------------------------ */
    getData(id) {
        return new Promise((resolve, reject) => {
            this.uSettings.getWhere("buffer, buy_ratio, sell_ratio ", "user_id="+id)
            .then((res) => {
                var prosumerdata = this.prosumerData.find(obj => obj.id == id)
                resolve ({
                    "id": prosumerdata.id,
                    "production": this.turbineGenerator(prosumerdata.wind[this.ticks]),
                    "consumption": prosumerdata.consumption[this.ticks],
                    "buffer": res.buffer,
                    "buy_ratio": res.buy_ratio,
                    "sell_ratio": res.sell_ratio,
                    "wind": prosumerdata.wind[this.ticks]
                })
            })
        })
    }

    setBufferRatio(id, data){
        console.log(data)
        data = JSON.parse(JSON.stringify(data)) // data = {id, input {buy, selll}}
        // update buffer ratio if user is authenticated
        return new Promise((resolve, reject) => {
            this.isAuthenticated(id).then( (auth) => {
                var res = {"status": undefined, "message": undefined}
                if(auth){
                    this.uSettings.updateBuyRatio(id, data.buy)
                    this.uSettings.updateSellRatio(id, data.sell)
                    res.status = true
                    res.message = "Buffer ratio updated!"
                } else {
                    res.status = false
                    res.message = "Could not update buffer ratio.."
                }
                resolve(res)
            })
        })
    }

    getAllProsumer(){
        return new Promise((resolve, reject) => {
            var res = new Array()
            this.users.getAllWhere("role="+AppSettings.database.roles.indexOf("prosumer")).then((users) => {
                users.forEach( post => {
                    var state = async () => await this.uSettings.getWhere("state", "user_id="+post.id).then((res) => AppSettings.database.states[res.state])
                    var user = {
                        "id": post.id,
                        "name": post.name,
                        "email": post.email,
                        "role": AppSettings.database.roles[post.role],
                        "state": state,
                        "online": post.online == 0?false:true
                    }
                    res.push(user)
                })
                resolve(res)
            })
        })
    }

    getProsumerInfo(id){
        return new Promise((resolve, reject) => {
            this.users.getAllWhere("id="+id).then((user) => {
                // var state = async () => await this.uSettings.getWhere("state", "user_id="+id).then((res) => AppSettings.database.states[res.state])
                var state = async () => await this.uSettings.getWhere("state", "user_id="+id).then((res) => console.log(res.state))
                var userResult = {
                    "id": user[0].id,
                    "name": user[0].name,
                    "email": user[0].email,
                    "role": AppSettings.database.roles[user[0].role],
                    "state": state,
                    "online": user[0].online == 0?false:true
                }
                resolve(userResult)
            })
        })
    }

    registerProsumer(args) {
        var input = args.input
        return new Promise((resolve, reject) => {
            var createUser = this.users.create(
                input.name,
                input.email,
                input.password,
                "default-user.jpg",
                AppSettings.database.roles.indexOf("prosumer"),
                "Luleå",
                0
            )
            createUser.then((res) => {
                if(res){
                    this.uSettings.create(
                        res.id, // user_id
                        0,      // buffer
                        0.5,    // buy_ratio
                        0.5,    // sell_ratio
                        0,      // consumption
                        0,      // production
                        2       // state
                    )
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }
    /* ------------------------------- API FUNCTIONS END -------------------------------- */
}

module.exports = Prosumer;