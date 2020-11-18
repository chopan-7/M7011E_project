// State.js

class State {
    constructor(dao) {
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS State (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL
        )`
        return this.dao.run(sql)
    }
}

module.exports = State;