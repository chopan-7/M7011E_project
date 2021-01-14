const AppSettings = require("../../appSettings")
const {databaseManager} = require("../data-fetcher")
const jwt = require('jsonwebtoken')

class Manager {
    constructor(){
        // connect to db
        this.users = databaseManager.users
        this.uSettings = databaseManager.uSettings

        // manager parameters
        this.data = {
            "state": 0,     // 0 = off, 1 = starting, 2 = running
            "buffer": 0,    // Manager buffer
            "bufferRatio": 1,
            "currentPrice": 1,
            "marketDemand": 0,
            "prosumerOutage": 0
        }

        // market electricity
        this.market = 0

        // Message to console
        console.log("Manager system created")
    }

    /* ------------------------------- USER FUNCTIONS BEGIN ----------------------------- */
    authenticate(email, password) {
        return new Promise((resolve, reject) =>{
            var role = AppSettings.database.roles.indexOf("manager")
            var signIn = this.users.userAuth(email, password, role)
            signIn.then((auth) => {
                var res = {"status": undefined, "message": undefined, "tokens": undefined}
                if(auth[0]){
                    // create access-token and refres-token
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
                    res.message = "User sigend in!"
                } else {
                    res.status = false
                    res.message = "Wrong username or password!"
                }
                resolve(res)
            })
            signIn.catch((err) => {
                resolve({"status": false, "message": "No manager registerd on this email.", "tokens": undefined})
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

    isProsumer(id) {
        return new Promise((resolve, reject) => {
            this.users.getWhere("id", "id="+id).then((prosumer) =>{
                if(prosumer[0].id == id){
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch( (err) => {
                console.log(err)
            })
        })
    }

    /* ------------------------------- USER FUNCTINOS END ---------------------------------- */

    /* ------------------------------- CORE FUNCTIONS START -------------------------------- */
    startProduction() {
        console.log("Starting production...")
        this.data.state = 1 // starting

        // starts the production after 30 sec
        setTimeout(() => {
            console.log("Production started.")
            this.data.state = 2 // started
            this.production()
            return this.data.state
        }, AppSettings.manager.startupTime)
    }

    stopProduction() {
        console.log("Shutting down production...")
        setTimeout(() => {
            console.log("Production stopped.")
            this.data.state = 0
            return this.data.state
        }, AppSettings.manager.startupTime)
    }

    production() {
        // portion the daily production
        var toBuffer = AppSettings.manager.production*this.data.bufferRatio
        var toMarket = AppSettings.manager.production-toBuffer
        
        // fill the buffer if bufferCap is reached and add the remaining to the market
        if((this.data.buffer+toBuffer) > AppSettings.manager.bufferCap){
            this.market += (toMarket + toBuffer + this.data.buffer - AppSettings.manager.bufferCap-this.data.buffer)
            this.data.buffer = AppSettings.manager.bufferCap
            
        } else {
            this.data.buffer += toBuffer
            this.market += toMarket
        }
        
        // continue production of coal plant state is 2
        if(this.data.state == 2){
            setTimeout( () => {
                this.production()
            }, AppSettings.simulator.duration.hour)
        }
    }

    currentMarketDemand() {
        // get data from prosumer & consumers
        var getDemand = this.uSettings.sumOf("consumption").then( (result) => {
            this.data.marketDemand = result['SUM(consumption)']
        })
    }

    /* ------------------------------- CORE FUNCTIONS END ------------------------------- */

    /* ------------------------------- API FUNCTIONS START ------------------------------ */
    /* The following functions are for Manager front-end client */
    getData(){
        // refresh currentMarketDemand
        this.currentMarketDemand()
        return this.data
    }

    managerStartStop(id) {
        // start/stop production depending on current state
        return new Promise((resolve, reject) => {
            this.isAuthenticated(id).then((auth) => {
                var res = {"status": undefined, "message": undefined}
                if (this.data.state == 0 && auth) {
                    this.startProduction()
                    res.stauts = true
                    res.message = `Starting production, est. time: ${AppSettings.manager.startupTime} sec.`
                } else if (auth) {
                    this.stopProduction()
                    res.stauts = true
                    res.message = `Stopping production, est. time: ${AppSettings.manager.startupTime} sec.`
                } else {
                    res.stauts = false
                    res.message = `Could not execute task..`
                }
                resolve(res)
            })
        })
    }

    setCurrentPrice(id, price) {
        return new Promise((resolve, reject) => {
            this.isAuthenticated(id).then((auth) => {
                var res = {"status": undefined, "message": undefined}
                if(auth){
                    this.data.currentPrice = price
                    res.status = true
                    res.message = `New price is ${this.data.currentPrice}`
                } else {
                    res.status = false
                    res.message = "Could not update the price."
                }
                resolve(res)
            })
        })
    }

    setBufferRatio(id, ratio) {
        return new Promise((resolve, reject) => {
            this.isAuthenticated(id).then((auth) => {
                var res = {"status": undefined, "message": undefined}
                if(auth){
                    this.data.bufferRatio = ratio
                    res.status = true
                    res.message = `Buffer ratio changed to ${100*this.data.bufferRatio}%.`
                } else {
                    res.status = false
                    res.message = "Could not update the buffer ratio."
                }
                resolve(res)
            })
        })

    }

    /* The following functions are for Prosumer backend system */
    addToMarket(id, amount) {
        return new Promise((resolve, reject) => {
            this.isProsumer(id).then((auth) => {
                if(auth) {
                    this.market += amount
                    // console.log(`+ Market: ${this.market}`)
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    drainMarket(id, amount) {
        return new Promise((resolve, reject) => {
            // check if requested by a prosumer
            this.isProsumer(id).then((auth) => {    
                var res = {"status": undefined, "fromMarket": undefined}
                if(auth) {
                    // empty market if amount > market
                    if(amount > this.market){
                        res.status = true
                        res.fromMarket = (amount-this.market)
                        this.market -= this.market
                        // console.log(`- Market: ${this.market}`)
                    } else {
                        this.market -= amount
                        res.status = true
                        res.fromMarket = amount
                    }
                } else {
                    res.status = false
                    res.fromMarket = 0
                }
                resolve(res)
            })
        })
    }
    /* ------------------------------- API FUNCTIONS END -------------------------------- */
}

module.exports = Manager;