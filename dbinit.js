/* 
Initiate database on first run
*/

// Importing required modules
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const AppDAO = require('./db/dao')
const Users = require('./db/Users')
const UserSettings = require('./db/UserSettings')
const ManagerSettings = require('./db/ManagerSettings')
const Role = require('./db/Role')
const State = require('./db/State')


function main(){
    // connect to database and initiate DAO
    const dao = new AppDAO('./db/app.db')
    const users = new Users(dao)
    const userSettings = new UserSettings(dao)
    const managerSettings = new ManagerSettings(dao)
    const role = new Role(dao)
    const state = new State(dao)

    var dbFile = "./db/app.db";        // database name

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

    // create tables if not exists
    users.createTable()
    userSettings.createTable()
    managerSettings.createTable()
    role.createTable()
    state.createTable()
}

main()