import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const jwt = require("jsonwebtoken")
const ProsumerOverview = () =>{
    const [production, setProduction] = useState('');
    const [consumption, setConsumption] = useState('');
    const [buffer, setBuffer] = useState('');
    const [wind, setWind] = useState('');
    

    

    useEffect(() => { 
        getOverview()
        setInterval(()=>{getOverview()},10000)
    }, [])

    const getOverview = () => {
        
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
                        production
                        consumption
                        buffer
                        wind
                    }
                }`
            }
        })
        .then((response) => {
            

            const data = response.data.data.prosumerData 
            
            
            setProduction(data.production)
            setConsumption(data.consumption)
            setBuffer(data.buffer)
            setWind(data.wind)
            
        })
        
    }
   
    
    return (
        <div> 
          <p>Current wind: {wind} </p>
          <p>Current production: {production} </p> 
          <p>Current consumtion: {consumption} </p> 
          <p>Current buffer: {buffer} </p> 
        </div>
    )
}

export default ProsumerOverview