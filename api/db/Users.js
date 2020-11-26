// Users,js

class Users {
    constructor(dao) {
        this.dao = dao
        this.createTable()  // create a new table if not exists
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL UNIQUE,
            password VARCHAR NOT NULL,
            picture VARCHAR,
            role INTEGER NOT NULL,
            location VARCHAR NOT NULL
        )`
        return this.dao.run(sql)
    }

    // Create a new user
    create(name, email, password, picture, role, location) {
        return this.dao.run(
            `INSERT INTO Users (
                name,
                email, 
                password,
                picture,
                role,
                location
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, password, picture, role, location])
    }

    // Update picture
    updatePicture(id, picture) {
        return this.dao.run(
            `UPDATE Users SET picture = ? WHERE id = ?`,
            [picture, id]
        )
    }

    // Update password
    updatePassword(id, password) {
        return this.dao.run(
            `UPDATE Users SET password = ? WHERE id = ?`,
            [id, password]
        )
    }

    // Update email
    updateEmail(id, email) {
        return this.dao.run(
            `UPDATE Users SET email = ? WHERE id = ?`,
            [id, email]
        )
    }

    // Get user by id
    getById(id) {
        return this.dao.get(
            `SELECT * FROM Users WHERE id = ?`,
            [id]
        )
    }

    // Get all users
    getAll() {
        return this.dao.all(
            `SELECT * FROM Users`
        )
    }

    // Delete function
    delete(id) {
        return this.dao.run(
            `DELETE * FROM Users WHERE id = ?`,[id]
        )
    }
}

module.exports = Users;