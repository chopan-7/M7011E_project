import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'
import { Card, Container, Button } from 'react-bootstrap'

const cookies = new Cookies()
const jwt = require("jsonwebtoken")

const ProsumerControll = () =>{
    const [buy_ratio, setBuyRatio] = useState()
    const [sell_ratio, setSellRatio] = useState()

    useEffect(() => { 
        getRatios()
    }, [])

    const updateBuy = (e) => {
        const update = new Promise((resolve, reject) => resolve(setBuyRatio(e.target.value/100)))
        update.then(()=> bufferSubmit())
    }

    const updateSell = (e) => {
        const update = new Promise((resolve, reject) => resolve(setSellRatio(e.target.value/100)))
        update.then(()=> bufferSubmit()) 
    }

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
            setBuyRatio(data.buy_ratio.toFixed(2))
            setSellRatio(data.sell_ratio.toFixed(2))
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
                    <p> Current buy ratio: {(buy_ratio)*100+"%"} </p>
                    <p> Current sell ratio: {(sell_ratio)*100+"%"} </p>
                    <form className="buffers" onSubmit={bufferSubmit}>
                        <div>                
                            <label>
                            Change buy ratio to: 
                            </label>
                            <input                    
                                type = "number"                
                                min = "0"
                                max = "100"
                                step = "1"
                                value = {buy_ratio*100}
                                name="buy_ratio"
                                onChange={(e) => {
                                    updateBuy(e)
                                }}
                            />
                            <label>
                            %
                            </label>

                        </div>

                        <div>                
                            <label>
                            Change sell ratio to:
                            </label>
                            <input
                                type = "number"                
                                min = "0"
                                max = "100"
                                step = "1"
                                value = {sell_ratio*100}
                                name="sell_ratio"
                                onChange={(e) => {
                                    updateSell(e)
                                }}
                            />
                            <label>
                            %
                            </label>        
                        </div>
                        <Button type = "submit" variant={'primary'} size={'sm'}>Save</Button>
                    </form>
                </Card.Body>
            </Card>
        </Container>
        </>
        
    )


}

export default ProsumerControll