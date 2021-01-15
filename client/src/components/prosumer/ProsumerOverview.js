import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'
import {addJobToCookie} from '../cookieHandler'

import getFromCookie from '../tokenHandler'

const cookies = new Cookies()

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
        var interval_id = window.setInterval(()=>{getOverview()},10000)   // update overview data every 10 sec
        addJobToCookie(interval_id)
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
            setNetProduction(data.production-data.consumption)
                     
        })

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/manager',
            data: {
                query: `query{
                    getCurrentPrice(input:{
                        access:"${getToken.token}"
                    })
                }`
            }
        })
        .then((response2) => {

            const data2 = response2.data.data.getCurrentPrice 
            setCurrentPrice(data2)
            

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
          <p>Current wind: {wind} </p>
          <p>Current production: {production} </p> 
          <p>Current consumtion: {consumption} </p>
          <p>Current net production: {net_production} </p> 
          <p>Current buffer: {buffer} </p> 
          <p>Current market price: {currentPrice} </p> 
          
        </div>
    )
}


export default ProsumerOverview
