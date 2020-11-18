// UserSettings.js

class UserSettings {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS UserSettings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            buffer INTEGER NOT NULL,
            buy_ratio FLOAT(2) NOT NULL,
            sell_ratio FLOAT(2) NOT NULL,
            consumption FLOAT(2) NOT NULL,
            production FLOAT(2) NOT NULL,
            state INTEGER NOT NULL,
            CONSTRAINT FK_userId FOREIGN KEY (user_id)
            REFERENCES Users(id)
        )`
        return this.dao.run(sql) 
    }
}

module.exports = UserSettings;