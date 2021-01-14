import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'

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
            
            setValues({
                buy_ratio: data.buy_ratio, 
                sell_ratio: data.sell_ratio,
                new_buy_ratio: data.buy_ratio,
                new_sell_ratio: data.sell_ratio
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
            url: 'http://localhost:8000/api/prosumer',
            data: {
                
                query: `mutation {
                    setBufferRatio(id: ${tokendata.userid}, input: {
                      buy: ${values.new_buy_ratio}
                      sell: ${values.new_sell_ratio}
                      token: "${getToken}"
                    }) {
                      status
                      message
                    }
                  }`
            } 

        })
        .then((response) => {
            const data = response.data.data.setBufferRatio
            alert(data.status)
        })
        getRatios()
        // setSubmitting(true);
        
    }

    return (
        <div>
            
            <p> Current buy ratio: {values.buy_ratio} </p>
            <p> Current sell ratio: {values.sell_ratio} </p>
            <form className="buffers" onSubmit={bufferSubmit}>
                <div>                
                    <label>
                    Change buy ratio to: 
                    </label>
                    <input                    
                        type = "number"                
                        min = "0"
                        max = "1"
                        step = "0.01"
                        value = {values.new_buy_ratio}
                        name="new_buy_ratio"
                        onChange={ChangeRatio}
                    />

                </div>

                <div>                
                    <label>
                    Change sell ratio to:
                    </label>
                    <input
                        type = "number"                
                        min = "0"
                        max = "1"
                        step = "0.01"
                        value = {values.new_sell_ratio}
                        name="new_sell_ratio"
                        onChange={ChangeRatio}
                    />        
                </div>
                <button type = "submit">
                    Save
                </button>
            </form>
        </div>
        
    )


}

export default ProsumerControll