import React, {useState} from 'react'
import RegisterSignup from '../components/register/RegisterSignup'
import RegisterSuccess from '../components/register/RegisterSuccess'
import Navigation from '../components/Navigation'
//import "Register.css"
const Register = () => {
    const [submitting, setSubmitting] = useState(false)
    function submitRegistration(){
        setSubmitting(true)
    }
    return (
         <div> 
             <Navigation type="public"/>
             {!submitting ? <RegisterSignup submitRegistration={submitRegistration}/> : <RegisterSuccess/>}
         </div>
         
        
    )
}

export default Register
