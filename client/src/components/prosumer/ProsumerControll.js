import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const jwt = require("jsonwebtoken")

const ProsumerControll = () =>{
    const [buyratio, setBuyratio] = useState('');
    const [sellratio, setSellratio] = useState('');


    useEffect(() => { 
        getRatios()
        //setInterval(()=>{getRatios()},10000)
    }, [])


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
            
            
            setBuyratio(data.buyratio)
            setSellratio(data.sellratio)
            
            
        })

    }
    








}

export default ProsumerControll