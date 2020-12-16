const AppSettings = require("../appSettings")
const AppDao = require("../api/db/dao")
const Users = require("../api/db/Users")
const UserSettings = require("../api/db/UserSettings")
const fetch = require("node-fetch")

// database module
class DatabaseManager{
    constructor(){
        this.dao = new AppDao(AppSettings.database.PATH)
        this.users = new Users(this.dao)
        this.uSettings = new UserSettings(this.dao)
    }
}
var databaseManager = new DatabaseManager() // exported

// handler for fetching data from API:s
function fetchFromSim(query) {
    return new Promise((resolve, reject) => {
        fetch(AppSettings.server+'/api/simulator',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query
            })
        })
        .then( (res) => {resolve(res.json())})
    })
};

function fetchFromMan(query) {
    return new Promise((resolve, reject) => {
        fetch(AppSettings.server+'/api/manager',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query
            })
        })
        .then( (res) => {resolve(res.json())})
    })
};

function fetchFromPro(query) {
    return new Promise((resolve, reject) => {
        fetch(AppSettings.server+'/api/prosumer',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query
            })
        })
        .then( (res) => {resolve(res.json())})
    })
};

module.exports = {
    fetchFromSim,
    fetchFromMan,
    fetchFromPro,
    databaseManager
}