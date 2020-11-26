class Prosumer {

    constructor(){
        this.turbine = 2 // kW (electricity production constant)
        this.buffer = 0 // battery 
        this.consumption = 0
    }


    //TODO: create production function
    production(wind) {
        return wind*this.turbine
    }

    // TODO: buy_ratio function
    // ...

    // TODO: sell_ratio function
    // ...

    // TODO: add electricity to buffer
    addToBuffer(value) {

    }

    // TODO: drain electricity from buffer
    drainBuffer(value) {

    }

}