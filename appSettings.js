const AppSettings = {
    // Global variables
    "server": "http://localhost:8000",
    "client": "http://localhost:3000",
    "database": "./api/db/app.db",

    // Simulator parameters
    "simulator": {
        "duration": {
            "hour": 10000,  // 10 sec
            "day": 10000,  // 240 sec
        },
        "consumption": {
            "minConsumption": 0,
            "maxConsumption": 2
        }
    }
}

module.exports = AppSettings;