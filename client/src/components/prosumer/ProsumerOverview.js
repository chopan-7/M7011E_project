import {useState, useEffect} from 'react'
import axios from "axios"
import {addJobToCookie} from '../cookieHandler'

import getFromCookie from '../tokenHandler'
import { Card, Container, Image, Row, Col } from 'react-bootstrap'


const ProsumerOverview = () =>{
    const [picture, setPicture] = useState('')
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
            url: '/api/prosumer',
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
            url: '/api/manager',
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
            setCurrentPrice(data2.toFixed(2))
        })

        axios({
            method: 'post',
            url: '/api/prosumer',
            data: {
                query: `query{
                    getProsumerInfo(id:${getToken.data.userid}, input:{
                        access:"${getToken.token}"
                    }){
                        state
                        picture
                                                                                                
                    }
                }`
            }
        })
        .then((response3) => {
            const data3 = response3.data.data.getProsumerInfo 
            setProductionState(data3.state)
            setPicture(data3.picture)

        })
        
    }
    
   
    
    return (
        <>
        <Container fluid style={{marginBottom: 10}}>
            <Card>
                <Card.Header>Prosumer overview</Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Image src={picture?picture:picture} thumbnail/>
                        </Col>
                        <Col>
                            <h3>Wind turbine status</h3>
                            <p>State: {state} </p> 
                            <p>Wind: {wind} m/s </p>
                            <p>Production: {production} kwh </p> 

                            <h3>Household status</h3>
                            <p>Consumtion: {consumption} kwh </p>
                            <p>Net production: {net_production} kwh </p> 
                            <p>Buffer: {buffer} kwh </p>

                            <h3>Market info</h3> 
                            <p>Current market price: {currentPrice} kr </p> 
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
        </>
    )
}


export default ProsumerOverview
