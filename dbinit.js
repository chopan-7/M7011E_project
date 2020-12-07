/* 
Initiate database on first run
*/

// Importing required modules
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const AppDAO = require('./api/db/dao')
const Users = require('./api/db/Users')
const UserSettings = require('./api/db/UserSettings')
const ManagerSettings = require('./api/db/ManagerSettings')
const Role = require('./api/db/Role')
const State = require('./api/db/State')
// const Weather = require('./api/db/Weather')  // TO BE REMOVED


function main(){
    // connect to database and initiate DAO
    var dbFile = "./api/db/app.db";        // database name
    const dao = new AppDAO(dbFile)
    const users = new Users(dao)
    const userSettings = new UserSettings(dao)
    const managerSettings = new ManagerSettings(dao)
    const role = new Role(dao)
    const state = new State(dao)
    // const weather = new Weather(dao)     // TO BE REMOVED


    // Create a new database-file if not exist
    try{
        if(fs.existsSync(dbFile)){
            console.log("Using database: "+path.basename(dbFile, path.extname(dbFile)));
        } else {
            // create new database file
            fs.writeFile(dbFile,"", function (err){
                if(err) throw err;
                console.log("Successfully created database "+path.basename(dbFile, path.extname(dbFile))+"!");
            });
        }
    } catch(err) {
        console.error(err);
    }
}

main()