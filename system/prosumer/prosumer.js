class Prosumer {

    constructor(){
        this.turbine = 2 // kW (electricity production constant)
        this.buffer = 0 // battery 
        this.consumption = 0
    }


    //TODO: create production function 
    production(wind) {
        pi = Math.PI
        r = 58          //radius of turbine
        v = wind        // wind velocity m/s
        effi = 0.4      //efficeny %
        dens = 1.2      //air density 
        power = (pi/2 * v**3 * r**2 * dens * effi)/1000 //(power of turbine: P = π/2 * r² * v³ * ρ * η) in KW
        return power
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