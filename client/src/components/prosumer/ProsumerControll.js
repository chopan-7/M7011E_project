import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const jwt = require("jsonwebtoken")

const ProsumerControll = () =>{
    const [buy_ratio, setBuyratio] = useState('');
    const [sell_ratio, setSellratio] = useState('');


    useEffect(() => { 
        getRatios()
        //setInterval(()=>{getRatios()},10000)
    }, [])

    const ChangeBuyRatio = e => {
       
    }

    const ChangeSellRatio = e => {
       
    }


    const getRatios = () => {

        const getToken = cookies.get('accessToken')
        const tokendata = jwt.verify(getToken, "Security is always excessive until it's not enough.")
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/prosumer',
            data: {
                query: `query{
                    prosumerData(id:${tokendata.userid}, input:{
                        access:"${getToken}"
                    }){
                        buy_ratio
                        sell_ratio
                                                
                    }
                }`
            }
        })
        .then((response) => {
            

            const data = response.data.data.prosumerData 
            
            
            setBuyratio(data.buy_ratio)
            setSellratio(data.sell_ratio)
            
            
        })
        

    }
    return (
        <div>
            

            <div>
                <p> Current buy ratio: {buy_ratio} </p>
                <label>
                Change buy ratio to: 
                </label>
                <input                    
                    type = "number"                    
                    min = "0.00"
                    max = "1.00"
                    step = "0.01"
                    onChange={ChangeBuyRatio}
                />

            </div>

            <div>
                <p> Current sell ratio: {sell_ratio} </p>
                <label>
                Change sell ratio to:
                </label>
                <input
                    type = "number"                
                    min = "0.00"
                    max = "1.00"
                    step = "0.01"
                    onChange={ChangeSellRatio}
                />        
            </div>
        </div>
        
    )


}

export default ProsumerControll