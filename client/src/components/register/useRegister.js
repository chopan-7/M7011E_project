import {useState, useEffect} from 'react'
const axios = require('axios')

const useRegister = (callback, validate) =>{
    // check the role of the user
    const currentUrl = window.location.href.split('/')
    const endPoint = currentUrl[currentUrl.length -1].split('_')[0]
    const role = endPoint !== 'manager'?'prosumer':endPoint

    const [values, setValues] = useState({
        name:'',
        email:'',
        password:'',
        passwordc:'',
        key:'',
        picture:'',
        role: role
    })
    

    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const controlChange = e => {
        const {name, value} = e.target
        setValues({
            ...values,
            [name]: value
        }) 
        
    }


    const handleSubmit = e => {
        setErrors(validate(values));
        axios({
            method: 'post',
            url: '/api/'+role,
            data: {
                query: `mutation {
                    register(input:{
                      name: "${values.name}"
                      email: "${values.email}"
                      password: "${values.password}"
                      picture: "${values.picture}"
                    })
                  }`
            }

        })
        e.preventDefault();
    
        setSubmitting(true);
        
    }

    useEffect(() =>{
        if(Object.keys(errors).length === 0 &&
        submitting){
            callback();
        }
    },[errors]
    )
    return {controlChange, values, handleSubmit, errors}
}
export default useRegister
