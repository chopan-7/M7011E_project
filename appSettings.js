const AppSettings = {
    // Global variables
    "server": "http://localhost:8000",
    "client": "http://localhost:3000",
    "database": {
        "PATH": "./api/db/app.db",
        "roles": ["prosumer", "consumer", "manager"],
        "states": ["outage", "producing", "idle"]
    },

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
    },

    // Prosumer parameters
    "prosumer": {
        "bufferCap": 10000 // 1e4 kWh
    },
    
    // Manager parameters
    "manager": {
        "startupTime": 30000, // 30 sec to start/stop the coal plant
        "bufferCap": 1000000, // 1e6 kWh
        "production": 41500   // 41500 kWh production per hour
    }
}

module.exports = AppSettings;