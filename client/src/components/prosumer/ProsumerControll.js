import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'
import { Card, Container, Button } from 'react-bootstrap'

const cookies = new Cookies()
const jwt = require("jsonwebtoken")

const ProsumerControll = () =>{
    // const [buy_ratio, setBuyratio] = useState('');
    // const [sell_ratio, setSellratio] = useState('');

    const [values, setValues] = useState({
        buy_ratio: '',
        sell_ratio: '',
        new_buy_ratio: '',
        new_sell_ratio: ''
    })


    useEffect(() => { 
        getRatios()
        //setInterval(()=>{getRatios()},10000)
    }, [])

    const ChangeRatio = e => {
        const {name, value} = e.target
        setValues({
            ...values,
            [name]: value
        })
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
            
            setValues({
                buy_ratio: data.buy_ratio.toFixed(2), 
                sell_ratio: data.sell_ratio.toFixed(2),
                new_buy_ratio: (data.buy_ratio*100),
                new_sell_ratio: (data.sell_ratio*100)
            })
            
            // setBuyratio(data.buy_ratio)
            // setSellratio(data.sell_ratio)
            
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
                      buy: ${(values.new_buy_ratio)/100}
                      sell: ${(values.new_sell_ratio)/100}
                      token: "${getToken}"
                    }) {
                      status
                      message
                    }
                  }`
            } 

        })
        getRatios()
        // setSubmitting(true);
        
    }

    return (
        <>
        <Container fluid>
            <Card>
                <Card.Header>Prosumer controll</Card.Header>
                <Card.Body>
                    <p> Current buy ratio: {(values.buy_ratio)*100+"%"} </p>
                    <p> Current sell ratio: {(values.sell_ratio)*100+"%"} </p>
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
                                value = {values.new_buy_ratio}
                                name="new_buy_ratio"
                                onChange={ChangeRatio}
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
                                value = {values.new_sell_ratio}
                                name="new_sell_ratio"
                                onChange={ChangeRatio}
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