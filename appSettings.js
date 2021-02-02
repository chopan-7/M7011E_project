const AppSettings = {
    // Global variables
    "server": "http://localhost:8000",
    "client": "http://localhost:3000",
    "database": {
        "PATH": "./api/db/app.db",
        "roles": ["prosumer", "consumer", "manager"],
        "states": ["outage", "producing", "idle"]
    },
    "secrets": {
        "access": "Security is always excessive until it's not enough.",
        "refresh": "You can't change who you are, but you can change what you have in your head.",
        "unsign": "You'll never catch me alive!"
    },

    // URL:s for API:s used in this application
    "api": {
        "simulator": "http://localhost:8000/api/simulator",
        "prosumer": "http://localhost:8000/api/prosumer",
        "manager": "http://localhost:8000/api/manager"
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
    },

    // Consumer (default)
    "consumer": {
        info: {
            "name": "Consumer1",
            "email": "c1@greenlight.org",
            "password": "c1",
            "picture": "c1.jpg",
            "role": 1,
            "location": "luleå",
            "online": 0
        },
        settings: {
            "buffer": "",
            "buy_ratio": 0.5,
            "sell_ratio": 0.5,
            "consumption": 500,
            "production": 4.0,
            "state":2
        }
    }
}

module.exports = AppSettings;