import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'
import { Card, Container, Form } from 'react-bootstrap'

const cookies = new Cookies()
const jwt = require("jsonwebtoken")

const ProsumerControll = () =>{
    const [buy_ratio, setBuyRatio] = useState()
    const [sell_ratio, setSellRatio] = useState()

    // get values on render
    useEffect(() => { 
        getRatios()
    }, [])

    // update submit reactivly
    useEffect(() => {
        bufferSubmit()
    }, [buy_ratio, sell_ratio])

    const getRatios = () => {
        const getToken = cookies.get('accessToken')
        const tokendata = jwt.verify(getToken, "Security is always excessive until it's not enough.")
        axios({
            method: 'post',
            url: '/api/prosumer',
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
            setBuyRatio(data.buy_ratio)
            setSellRatio(data.sell_ratio)
        })        
    }

    const bufferSubmit = () => {
        const getToken = cookies.get('accessToken')
        const tokendata = jwt.verify(getToken, "Security is always excessive until it's not enough.")
        axios({
            method: 'post',
            url: '/api/prosumer',
            data: {
                
                query: `mutation {
                    setBufferRatio(id: ${tokendata.userid}, input: {
                      buy: ${buy_ratio}
                      sell: ${sell_ratio}
                      token: "${getToken}"
                    }) {
                      status
                      message
                    }
                  }`
            } 

        })
    }

    return (
        <>
        <Container fluid>
            <Card>
                <Card.Header>Prosumer controll</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <Form.Group controlId="buy_ratio" style={{marginRight: 50}}>
                                <Form.Label>Buy ratio: {Math.floor(buy_ratio*100)}%</Form.Label>
                                <Form.Control type="range" name="buy_ratio" value={buy_ratio} 
                                min="0" max="1" step="0.01" custom 
                                onChange={e => setBuyRatio(e.target.value)}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId="sell_ratio">
                                <Form.Label>Sell ratio: {Math.floor(sell_ratio*100)}%</Form.Label>
                                <Form.Control type="range" name="sell_ratio" value = {sell_ratio} 
                                min="0" max="1" step="0.01" custom 
                                onChange={e => setSellRatio(e.target.value)}/>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </>  
    )


}

export default ProsumerControll