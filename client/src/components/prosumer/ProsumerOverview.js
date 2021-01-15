import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'

import getFromCookie from '../tokenHandler'

const ProsumerOverview = () =>{

    const [production, setProduction] = useState('');
    const [consumption, setConsumption] = useState('');
    const [buffer, setBuffer] = useState('');
    const [wind, setWind] = useState('');
    const [net_production, setNetProduction] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [state, setProductionState] = useState('');

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
                        
            setProduction(data.production.toFixed(2))
            setConsumption(data.consumption.toFixed(2))
            setBuffer(data.buffer.toFixed(2))
            setWind(data.wind.toFixed(2))
            setNetProduction((data.production-data.consumption).toFixed(2))
                     
        })

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/manager',
            data: {
                query: `query{
                    managerData(input:{
                        access:"${getToken.token}"
                    }){
                        currentPrice
                                                                                                
                    }
                }`
            }
        })
        .then((response2) => {

            const data2 = response2.data.data.managerData 
            setCurrentPrice(data2.currentPrice.toFixed(2))
            

        })

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/prosumer',
            data: {
                query: `query{
                    getProsumerInfo(id:${getToken.data.userid}, input:{
                        access:"${getToken.token}"
                    }){
                        state
                                                                                                
                    }
                }`
            }
        })
        .then((response3) => {
            
            const data3 = response3.data.data.getProsumerInfo 
            
            setProductionState(data3.state)

        })
        
    }
   
    
    return (
        <div>
          <p>Current state: {state} </p> 
          <p>Current wind: {wind} m/s </p>
          <p>Current production: {production} kwh </p> 
          <p>Current consumtion: {consumption} kwh </p>
          <p>Current net production: {net_production} kwh </p> 
          <p>Current buffer: {buffer} kwh </p> 
          <p>Current market price: {currentPrice} kr </p> 
          
        </div>
    )
}


export default ProsumerOverview
