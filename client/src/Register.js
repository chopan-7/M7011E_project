import React, {useState} from 'react'
import RegisterSignup from './RegisterSignup'
import RegisterSuccess from './RegisterSuccess'
//import "Register.css"
const Register = () => {
    const [submitting, setSubmitting] = useState(false)
    function submitRegistration(){
        setSubmitting(true)
    }
    return (
         <div> 
             {!submitting ? <RegisterSignup submitRegistration={submitRegistration}/> : <RegisterSuccess/>}
         </div>
        
    )
}

export default Register
