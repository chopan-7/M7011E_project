var Normaldist = require("./normaldist");

class Weather{
    constructor(){
        this.data = require('./data/2019_data.json');
        this.normal = new Normaldist()
        this.winds = []; 
        this.date;

    }
    
    //get a random int in a intervall
    intBetween(start, end){
        return Math.floor(Math.random()*(end-start)+start)
    }
    //get a random date from data sort all winds from that date
    getDate(){
        this.date = this.data[intBetween(0, this.data.length)].Datum
        for (var i = 0; i <this.data.length; i++){
            if (this.data[i].Datum == this.date){
                this.winds.push(parseFloat(this.data[i].Vindhastighet))

            }
        }  
        this.winds = this.winds.sort(function (a, b) {return a - b;});
    }
    //get a list of simulated winds for 24h
    getWind(){
        simwinds=[];
        min = this.winds[0]
        max = this.winds[winds.length-1]
        wind = intBetween(min, max+1)

        for (var j = 0; j <24; j++){
            min = wind - 2
            max = wind + 2
            if (min<0){
                min = 0
            }
            skew = 1
            wind = this.normal.randn_bm(min, max, skew)
            
            simwinds.push(wind)
            
        }  
        return simwinds
        
    }
}

module.exports = Weather;
