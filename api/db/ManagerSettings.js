// ManagerSettings.js

class ManagerSettings {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS ManagerSettings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            manager_id INTEGER NOT NULL,
            production FLOAT(2) NOT NULL,
            buffer INTEGER NOT NULL,
            buffer_ratio FLOAT(2) NOT NULL,
            state INTEGER NOT NULL,
            CONSTRAINT FK_managerId FOREIGN KEY (manager_id)
            REFERENCES Users(id)
        )`
        return this.dao.run(sql)
    }
}

module.exports = ManagerSettings;