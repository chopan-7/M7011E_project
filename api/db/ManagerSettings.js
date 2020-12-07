// ManagerSettings.js

class ManagerSettings {
    constructor(dao) {
        this.dao = dao
        this.createTable()  // create a new table if not exists
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS ManagerSettings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            manager_id INTEGER NOT NULL UNIQUE,
            production FLOAT(2) NOT NULL,
            buffer INTEGER NOT NULL,
            buffer_ratio FLOAT(2) NOT NULL,
            state INTEGER NOT NULL,
            currentPrice FLOAT(2) NOT NULL,
            CONSTRAINT FK_managerId FOREIGN KEY (manager_id)
            REFERENCES Users(id)
        )`
        return this.dao.run(sql)
    }

    create(manager_id, production, buffer, buffer_ratio, state, currentPrice) {
        return this.dao.run(`INSERT INTO ManagerSettings (
            manager_id,
            production,
            buffer, 
            buffer_ratio,
            state,
            currentPrice
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [manager_id, production, buffer, buffer_ratio, state, currentPrice])
    }

    // update functions
    updateProduction(manager_id, production) {
        return this.dao.run(
            `UPDATE ManagerSettings SET production = ? WHERE id = ?`,
            [production, manager_id]
        )
    }

    updateBuffer(manager_id, buffer) {
        return this.dao.run(
            `UPDATE ManagerSettings SET buffer = ? WHERE id = ?`,
            [buffer, manager_id]
        )
    }

    updateBufferRatio(manager_id, ratio) {
        return this.dao.run(
            `UPDATE ManagerSettings SET buffer_ratio = ? WHERE id = ?`,
            [ratio, manager_id]
        )
    }

    updateState(manager_id, state) {
        return this.dao.run(
            `UPDATE ManagerSettings SET state = ? WHERE id = ?`,
            [state, manager_id]
        )
    }

    updateCurrentPrice(manager_id, currentPrice) {
        return this.dao.run(
            `UPDATE ManagerSettings SET currentPrice = ? WHERE id = ?`,
            [currentPrice, manager_id]
        )
    }

    // get functions
    getById(manager_id) {
        return this.dao.get(
            `SELECT * FROM ManagerSettings WHERE id = ?`,[manager_id]
        )
    }

    getAll(){
        return this.dao.get(
            `SELECT * FROM ManagerSettings`
        )
    }

    // Return sum of given columns
    sumOf(column) {
        return this.dao.get(
            `SELECT SUM(${column}) FROM ManagerSettings`
        )
    }

    // delete function
    delete(id) {
        return this.dao.run(
            `DELETE FROM ManagerSettings WHERE manager_id = ?`,[id]
        )
    }
}

module.exports = ManagerSettings;