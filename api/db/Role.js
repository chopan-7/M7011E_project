// Role.js

class Role {
    constructor(dao) {
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS Role (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL
        )`
        return this.dao.run(sql)
    }
}

module.exports = Role;