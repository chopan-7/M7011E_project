// Role.js

class Role {
    constructor(dao) {
        this.dao = dao
        this.createTable()  // create a new table if not exists
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS Role (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL
        )`
        return this.dao.run(sql)
    }

    create(role) {
        return this.dao.run(
            `INSERT INTO Role (name) VALUES (?)`,[role]
        )
    }

    getRole(id) {
        return this.dao.get(
            `SELECT * FROM Role WHERE id = ?`,[id]
        )
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM Role WHERE id = ?`,[id]
        )
    }

}

module.exports = Role;