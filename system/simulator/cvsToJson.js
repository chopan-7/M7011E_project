//simulator
//function cvsToJson (csvFilePath, jsonFilePath){
const csvFilePath='./data/smhi_2019_data.csv'
//const csvFilePath
const csv = require('csvtojson')
const fs = require("fs")
var jsonFilePath = "./data/2019_data.json"

csv({delimiter:';'})
.fromFile(csvFilePath)
.then((jsonObj)=>{
    
    //console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 
    fs.writeFileSync(jsonFilePath,JSON.stringify(jsonObj,"utf-8"))
})




