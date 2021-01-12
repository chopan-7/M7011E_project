import {useState, useEffect} from 'react'

const useRegister = (callback, validate) =>{
    const [values, setValues] = useState({
        name:'',
        email:'',
        password:'',
        passwordc:''
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
        e.preventDefault();
        
        setErrors(validate(values));
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
