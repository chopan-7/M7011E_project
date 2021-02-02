const { resolve } = require("bluebird")

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
            location VARCHAR NOT NULL,
            online BIT(1) DEFAULT 0
        )`
        return this.dao.run(sql)
    }

    // Create a new user
    create(name, email, password, picture, role, location, online) {
        return this.dao.run(
            `INSERT INTO Users (
                name,
                email, 
                password,
                picture,
                role,
                location,
                online
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, password, picture, role, location, online])
    }

    // Authentication
    userAuth(email, password, role){
        var checkUser = this.dao.get(`SELECT id, email, password FROM Users WHERE email = ? AND role=?`,[email, role])
        return checkUser.then((user) => {
            return new Promise((resolve, reject) => {
                if(user != undefined && password == user.password){
                    var changeStatus = this.dao.run(`UPDATE Users SET online=1 WHERE id = ?`, [user.id])
                    resolve([true, {"id": user.id, "email": user.email}])
                } else {
                    resolve([false, "User not found."])
                }
            })
        })
    }

    signOut(id) {
        return this.dao.run(`UPDATE Users SET online=0 WHERE id=?`,[id])
    }

    // generic update
    update(columns, condition) {
        return this.dao.run(`UPDATE Users SET ? WHERE ?`,[columns, condition])
    }

    // Update picture
    updateName(id, name) {
        return this.dao.run(
            `UPDATE Users SET name = ? WHERE id = ?`,
            [name, id]
        )
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
            [password, id]
        )
    }

    // Update email
    updateEmail(id, email) {
        return this.dao.run(
            `UPDATE Users SET email = ? WHERE id = ?`,
            [email, id]
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

    // Get all order by ASC or DEC
    getOrderedBy(order) {
        if (order == "desc") {
            return this.dao.all(
                `SELECT * FROM Users ORDER BY id DESC`
            )
        } else {
            return this.dao.all(
                `SELECT * FROM Users ORDER BY id ASC`
            )
        }
    }

    getAllWhere(condition) {
        return this.dao.all(
            `SELECT * FROM Users WHERE ${condition}`
        )
    }

    getWhere(columns, condition) {
        return this.dao.all(
            `SELECT ${columns} FROM Users WHERE ${condition}`
        )
    }

    // return number of users with given role-id
    countUsers(role) {
        return this.dao.get(
            `SELECT COUNT(id) FROM Users WHERE role=${role}`
        )
    }

    // Delete function
    delete(id) {
        return this.dao.run(
            `DELETE FROM Users WHERE id = ?`,[id]
        )
    }
}

module.exports = Users;