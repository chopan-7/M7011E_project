// UserSettings.js

class UserSettings {
    constructor(dao) {
        this.dao = dao
        this.createTable()  // create a new table if not exists
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS UserSettings (
            user_id INTEGER NOT NULL PRIMARY KEY,
            buffer INTEGER NOT NULL,
            buy_ratio FLOAT(2) NOT NULL,
            sell_ratio FLOAT(2) NOT NULL,
            consumption FLOAT(2) NOT NULL,
            production FLOAT(2) NOT NULL,
            state INTEGER NOT NULL,
            CONSTRAINT FK_userId FOREIGN KEY (user_id)
            REFERENCES Users(user_id)
        )`
        return this.dao.run(sql) 
    }
    
    // Create user settings for given user_id (FK)
    create(user_id, buffer, buy_ratio, sell_ratio, consumption, production, state) {
        return this.dao.run(
            `INSERT INTO UserSettings (
                user_id,
                buffer, 
                buy_ratio, 
                sell_ratio, 
                consumption, 
                production,
                state)`,
                [user_id, buffer, buy_ratio, sell_ratio, consumption, production, state]
        )
    }

    // Update functions
    updateConsumption(user_id, consumption) {
        return this.dao.run(
            `UPDATE UserSettings SET consumption = ? WHERE user_id = ?`,
            [consumption, user_id]
        )
    }

    updateProduction(user_id, production) {
        return this.dao.run(
            `UPDATE UserSettings SET production = ? WHERE user_id = ?`,
            [consumption, production]
        )
    }

    updateState(user_id, state) {
        return this.dao.run(
            `UPDATE UserSettings SET state = ? WHERE user_id = ?`,
            [state, user_id]
        )
    }

    updateBuffer(user_id, buffer) {
        return this.dao.run(
            `UPDATE UserSettings SET buffer = ? WHERE user_id = ?`,
            [state, buffer]
        )
    }

    updateSellRatio(user_id, sell_ratio) {
        return this.dao.run(
            `UPDATE UserSettings SET sell_ratio = ? WHERE user_id = ?`,
            [state, sell_ratio]
        )
    }

    updateBuyRatio(user_id, buy_ratio) {
        return this.dao.run(
            `UPDATE UserSettings SET buy_ratio = ? WHERE user_id = ?`,
            [state, buy_ratio]
        )
    }

    // Get functions
    getById(user_id){
        return this.dao.get(
            `SELECT * FROM UserSettings WHERE user_id = ?`,[user_id]
        )
    }

    // Delete function
    delete(id) {
        return this.dao.run(
            `DELETE * FROM UserSettings WHERE user_id = ?`,[id]
        )
    }

}

module.exports = UserSettings;