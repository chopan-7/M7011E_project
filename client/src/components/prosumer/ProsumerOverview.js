import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'
import getFromCookie from '../tokenHandler'


const Overview = () =>{
    const [production, setProduction] = useState('');
    const [consumption, setConsumption] = useState('');
    const [buffer, setBuffer] = useState('');
    const [wind, setWind] = useState('');

    useEffect(() => { // kanske asyn sen ?
        getOverview()
        setInterval(()=>{getOverview()},10000)
    }, [])

    const getOverview = () => {
        
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/prosumer',
            data: {
                query: `query{
                    prosumerData(id:${getToken.data.userid}, input:{
                        access:"${getToken.token}"
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

export default Overview