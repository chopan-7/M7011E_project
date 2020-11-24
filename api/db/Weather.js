// Weather.js

class Weather {
    constructor(dao){
        this.dao = dao
        this.createTable()  // create a new table if not exists
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS Weather (
            location NOT NULL UNIQUE,
            wind NOT NULL
        )`
    }

    create(location, wind){
        return this.dao.run(
            `INSERT INTO Weather (location, wind)
            VALUES (?, ?)`,
            [location, wind])
    }

    updateWind(location, wind) {
        return this.dao.run(
            `UPDATE Weather SET wind = ? WHERE location = ?`,[wind, location]
        )
    }

    getByLocation(location) {
        return this.dao.get(
            `SELECT * FROM Weather WHERE location = ?`,[location]
        )
    }

    delete(location) {
        return this.dao.run(
            `DELETE * FROM Weather WHERE location = ?`,[location]
        )
    }
}

module.export = Weather;