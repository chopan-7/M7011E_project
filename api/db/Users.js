// Users,js

class Users {
    constructor(dao) {
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            password VARCHAR NOT NULL,
            picture VARCHAR,
            role INTEGER
        )`
        return this.dao.run(sql)
    }
}

module.exports = Users;