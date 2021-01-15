import {useState, useEffect} from 'react'
import axios from "axios"
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const jwt = require("jsonwebtoken")
const ManagerUserInfo = () =>{

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    

    useEffect(() => { 
        getUser()
        
    }, [])

    const getUser= () => {
        
        const getToken = cookies.get('accessToken')
        const tokendata = jwt.verify(getToken, "Security is always excessive until it's not enough.")
        
        axios({
            method: 'post',
            url: '/api/manager',
            data: {
                query: `query{
                    getManagerInfo(id:${tokendata.userid}, input:{
                        access:"${getToken}"
                    }){
                        name
                        email
                        
                    }
                }`
            }
        })
        .then((response) => {
            

            const data = response.data.data.ManagerInfo 
            
            
            setName(data.name)
            setEmail(data.email)
            
        })
        
    }
   
    
    return (
        <div> 
          <p>Full name: {name} </p>
          <p>User email: {email} </p>
          
        </div>
    )
}

export default ManagerUserInfo