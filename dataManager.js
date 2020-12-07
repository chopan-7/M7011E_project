const Dao = require("./api/db/dao")
const Users = require("./api/db/Users")
const ManagerSettings = require("./api/db/ManagerSettings")
const UserSettings = require("./api/db/UserSettings")
const Role = require("./api/db/Role")
const State = require("./api/db/State")


class DatabaseManager {
    constructor(){
        this.dao = new Dao("./api/db/app.db")
        this.users = new Users(this.dao)
        this.uSettings = new UserSettings(this.dao)
        this.mSettings = new ManagerSettings(this.dao)
        this.role = new Role(this.dao)
        this.state = new State(this.dao)
    }

    // create roles and states
    createRoles(){
        var roles = ["consumer", "prosumer", "manager"]
        roles.forEach(r => {
            this.role.create(r)
        });
    }
    
    createStates(){
        var states = ["outage", "producing", "not producing", "online", "offline"]
        states.forEach(s => {
            this.state.create(s)
        });
    }

    deleteRole(id) {
        this.role.delete(id)
    }

    deleteState(id) {
        this.state.delete(id)
    }

    createUser(users) {
        users.forEach(user => {
            var info = user.info
            var settings = user.settings
            var uid = this.users.create(
                info.name,
                info.email,
                info.password,
                info.picture,
                info.role,
                info.location
            ).then((newUser) => {
                this.uSettings.create(
                    newUser.id,
                    settings.buffer,
                    settings.buy_ratio,
                    settings.sell_ratio,
                    settings.consumption,
                    settings.production,
                    settings.state
                )
            })
        })
    }

    createManager(managers) {
        managers.forEach(manager => {
            var info = manager.info
            var settings = manager.settings
            this.users.create(
                info.name,
                info.email,
                info.password,
                info.picture,
                info.role,
                info.location
            ).then((newManager) => {
                this.mSettings.create(
                    newManager.id,
                    settings.production,
                    settings.buffer,
                    settings.buffer_ratio,
                    settings.state,
                    settings.currentPrice
                )
            })
        })
    }

}

module.exports = DatabaseManager;

function main(){
    var m = new DatabaseManager()
    var users = require("./users.json")
    var managers = require("./manager.json")

    // m.createUser(users)
    // m.createManager(managers)

    var sum;

    async function updateSum(summa) {
        sum = summa
        console.log(sum)
    }

    var res = m.uSettings.sumOf("consumption").then( (sum) => {
        updateSum(sum['SUM(consumption)'])
    })

    setTimeout(() => {
        console.log(sum)
    },1000)



}

main()