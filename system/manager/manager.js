const AppSettings = require("../../appSettings")
const {databaseManager} = require("../data-fetcher")
const jwt = require('jsonwebtoken')
const {generateConsumer} = require('./consumerGenerator')

class Manager {
    constructor(){
        // connect to db
        this.users = databaseManager.users
        this.uSettings = databaseManager.uSettings

        // manager parameters
        this.data = {
            "state": 0,     // 0 = off, 1 = starting, 2 = running
            "currentProduction": 0,
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
            var checkUser = this.users.getWhere("id, role", "id="+id)
            checkUser.then((user) => {
                if(user[0].role == AppSettings.database.roles.indexOf('manager')) {
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
            this.data.currentProduction = 0
            return this.data.state
        }, AppSettings.manager.startupTime)
    }

    production() {
        // portion the daily production
        var toBuffer = AppSettings.manager.production*this.data.bufferRatio
        var toMarket = AppSettings.manager.production-toBuffer

        // set current production
        this.data.currentProduction = toMarket
        
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
    getData(id){
        // refresh currentMarketDemand
        this.currentMarketDemand()

        if(this.data.state === 0){
            this.data.currentProduction = 0
        }
        // return this.data
        return new Promise((resolve, reject) => {
            this.isAuthenticated(id).then((auth) =>{
                var returnData = this.data
                if(auth){
                    AppSettings.database.roles.forEach(async (role) => {
                        await this.users.countUsers(AppSettings.database.roles.indexOf(role)).then((count) => {
                            switch(role) {
                                case "prosumer":
                                    returnData.prosumerCount = count['COUNT(id)']
                                    break;
                                case "consumer":
                                    returnData.consumerCount = count['COUNT(id)']
                                    break;
                                case "manager":
                                    returnData.managerCount = count['COUNT(id)']
                                    break;
                            }
                        })
                    })

                    resolve(this.data)
                }else{
                    reject("No access to data")
                }
                
            })
        })
    }

    getManagerInfo(id){
        return new Promise((resolve, reject) => {
            this.users.getAllWhere("id="+id).then((user) => {
                const states = ['Stopped', 'Starting', 'Running']
                var state = states[this.data.state]
                var userResult = {
                    "id": user[0].id,
                    "name": user[0].name,
                    "email": user[0].email,
                    "role": AppSettings.database.roles[user[0].role],
                    "state": state,
                    "picture": user[0].picture
                }
                this.isAuthenticated(id).then((auth) => {
                    if(auth){
                        resolve(userResult)
                    } else {
                        reject("No access to data")
                    }
                })
            })
        })
    }

    managerBlockUser(id, time) {
        return new Promise((resolve, reject) => {
            // set sell ratio of user to 0
            this.uSettings.getById(id).then((user) => {
                const currentRatio = user.sell_ratio;
                this.uSettings.updateSellRatio(id, 0).then((res) => {
                    console.log("blocking user..."+id)
                    // reset the sell_ratio after 30 sec
                    setTimeout(() => {
                        this.uSettings.updateSellRatio(id, currentRatio)
                        .then((res) => {
                            console.log('Unblocking user..'+id)
                            resolve({status: true, message: 'user '+id+' was blocked for '+time/1000+' seconds'})
                        })
                    }, time)
                })
            })
        })
    }

    managerDeleteUser(id, manId) {
        return new Promise((resolve, reject) => {
            //Delete user settings and data
            this.isAuthenticated(manId).then((auth) => {
                if(!auth){
                    resolve({status: false, message: 'Unauthorized action.'})
                }
                this.uSettings.delete(id).then(() => {
                    this.users.delete(id)
                    .then(() => resolve({status: true, message: 'User deleted'}))
                    .catch((err) => reject({status: false, message: 'Could not delete user from user.'}))
                })
                .catch((err) => reject({status: false, message: 'Could not delete user from user and settings.'}))
            })
        })
    }

    managerUpdateUser(manId, data) {
        console.log(data)
        return new Promise((resolve, reject) => {
            // Update user information
            this.isAuthenticated(manId).then((auth) => {
                if(!auth) {
                    resolve({status: false, message: 'Unauthorized action.'})
                }
                if(data.input.name != "undefined") {
                    this.users.updateName(data.input.id, data.input.name)
                }
                if(data.input.email != "undefined") {
                    this.users.updateEmail(data.input.id, data.input.email)
                }
                if(data.input.password != "undefined") {
                    this.users.updatePassword(data.input.id, data.input.password)
                }
                if(data.input.picture != "undefined") {
                    this.users.updatePicture(data.input.id, data.input.picture)
                }
                resolve({status: true, message: 'Success!'})
            })
        })
    }

    managerStartStop(id) {
        // start/stop production depending on current state
        return new Promise((resolve, reject) => {
            this.isAuthenticated(id).then((auth) => {
                var res = {"status": undefined, "message": undefined}
                if (this.data.state == 0 && auth) {
                    this.startProduction()
                    res.status = true
                    res.message = `Starting production, est. time: ${AppSettings.manager.startupTime/1000} sec.`
                } else if (auth) {
                    this.stopProduction()
                    res.status = true
                    res.message = `Stopping production, est. time: ${AppSettings.manager.startupTime/1000} sec.`
                } else {
                    res.status = false
                    res.message = `Could not execute task..`
                }
                resolve(res)
            })
        })
    }

    getCurrentPrice(){
        return this.data.currentPrice
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

    registerManager(args) {
        var input = args.input
        return new Promise((resolve, reject) => {
            var createUser = this.users.create(
                input.name,
                input.email,
                input.password,
                input.picture,
                AppSettings.database.roles.indexOf("manager"),
                "Luleå",
                0
            )
        }).then((res) => {
            if(res){
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }

    addUser(manId, role) {
        // check if manager authenticated
        return new Promise((resolve, reject) => {
            this.isAuthenticated(manId).then((auth) => {
                var res = {"status": false, "message": undefined}
                if(auth){
                    // add consumer/prosumer with standard settings
                    var {name, email} = generateConsumer()
                    var newConsumer = AppSettings.consumer
                    newConsumer.info.name = name
                    newConsumer.info.email = email
                    console.log(newConsumer)
                    var createConsumer = this.users.create(
                        newConsumer.info.name,
                        newConsumer.info.email,
                        "1111",
                        newConsumer.info.picture,
                        AppSettings.database.roles.indexOf(role),
                        newConsumer.info.location,
                        0
                    )
                    createConsumer.then((newUser) => {
                            console.log(newUser.id)
                            this.uSettings.create(
                                newUser.id,
                                newConsumer.settings.buffer,
                                newConsumer.settings.buy_ratio,
                                newConsumer.settings.sell_ratio,
                                newConsumer.settings.consumption,
                                newConsumer.settings.production,
                                newConsumer.settings.state
                            ).then((newSettings) => {
                                res.status = true
                                res.message = "New user created."
                                resolve(res)
                            })
                        })
                } else {
                    res.message = "No permission to perform action"
                    resolve(res)
                }
                
            })
        })
    }

    removeConsumer(manId) {
        // check if manager authenticated
        return new Promise((resolve, reject) => {
            this.isAuthenticated(manId).then((auth) => {
                var res = {"status": false, "message": undefined}
                if(auth){
                    // remove consumer
                    this.users.getAllWhere(`role=${AppSettings.database.roles.indexOf('consumer')} order by id desc`)
                    .then((userList) => {
                        var deleteUser = userList[0]
                        console.log(deleteUser.id)
                        this.users.delete(deleteUser.id).then(() => {
                            this.uSettings.delete(deleteUser.id).then(() => {
                                res.message = "Consumer deleted"
                                res.status = true
                                resolve(res)
                            })
                        })
                    })
                } else {
                    res.message = "No permission to perform action"
                    resolve(res)
                }
                
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