
var data = require('./data/2019_data.json');
var winds = []; 
var date;
//get a random int in a intervall
function intBetween(start, end){
    return Math.floor(Math.random()*(end-start)+start)
}
//get a random date
function getDate(){
    date = data[intBetween(0, data.length)].Datum
    //return intBetween(0, data.length)
}

function getWind(){
    for (var i = 0; i <data.length; i++)
        if (data[i].Datum == date){
            winds.push(parseFloat(data[i].Vindhastighet))

        }
    winds = winds.sort(function (a, b) {  return a - b;  });
    min = winds[0]
    max = winds[winds.length-1]
    wind = intBetween(min, max+1)
    console.log(min);
    console.log(max);
    console.log(wind);
}

//console.log(getDate());
getDate()
getWind()
console.log(date);
console.log(winds);

//console.log(typeof(winds[0]));
