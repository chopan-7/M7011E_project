//var UserSettings = require ("/api/db/UserSettings")
//var MangerSettings = require ("/api/db/ManagerSettings")
var demand;
var supply;
var curPrice;

// constructor(){
//     this.demand;
//     this.supply;
// }

function getDemand(proDemand, conDemand){
    
    demand = proDemand + conDemand
    
}
function getSupply(proSupply, manSupply){
    
    supply = proSupply + manSupply 
    
}
function pricemodel(proDemand, conDemand, proSupply, manSupply){
    getDemand(proDemand, conDemand)
    getSupply(proSupply, manSupply)
    priceEqulibrium = 1 //price when demand = supply
    ratio = demand/supply
    curPrice = priceEqulibrium * ratio
}  
pricemodel(10,10,100,10)
console.log(curPrice);
