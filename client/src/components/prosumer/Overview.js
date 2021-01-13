import {useState, useEffect} from 'react'
import axios from "axios"

const useProsumerOverview = () =>{
    const [values, setValues] = useState({
        
        production:'',
        consumption:'',
        wind:'',
        //net_production:'',
        buffer:''
        //marketprice:''
        
    })

    const url = 'http://localhost:8000/api/prosumer'

    useEffect(() => { // kanske asyn sen ?
        getOverview()
    }, [])

    const getOverview = () => {
        //axios.get(url) //lägg till ("${url}saken")
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/prosumer',
            data: {
                query: `query{
                    prosumerData(id:1, input:{
                        access:token
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
            const overview = response.data // .wind ....
            
            const {production, value} = overview
            setValues({
                ...values,
            [production]: value
            })
            
        })
        .catch(error => console.error("error"))
    }
   
    
    return (
        <div> 
          <p>Current wind {values.wind}</p>
          <p>Current production {values.production}</p> 
          <p>Current consumtion {values.consumption}</p>  
        </div>
    )
}

export default useProsumerOverview