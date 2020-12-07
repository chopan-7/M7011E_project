// State.js

class State {
    constructor(dao) {
        this.dao = dao
        this.createTable()  // create a new table if not exists
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS State (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL
        )`
        return this.dao.run(sql)
    }

    create(state) {
        this.dao.run(
            `INSERT INTO State (name) VALUES (?)`,[state]
        )
    }

    get(id) {
        this.dao.get(
            `SELECT * FROM State where id = ?`,[id]
        )
    }

    delete(id) {
        this.dao.run(
            `DELETE FROM State WHERE id = ?`,[id]
        )
    }
}

module.exports = State;