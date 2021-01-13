import React from "react"
import useRegister from "./useRegister"
import validate from "./validateRegistration"
import "./Register.css"
import Button from 'react-bootstrap/Button'
const RegisterSignup = ({submitRegistration}) => {
    const {controlChange, values, handleSubmit, errors} = useRegister(submitRegistration, validate);
    
    return (
        <div className = "form-how">
            <form className="form" onSubmit={handleSubmit}>
                <h1>
                    Registration page
                </h1>
                <div className="form-group">
                    <label htmlFor="name"
                    className="form-label">
                    Name  
                    </label>
                    <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={values.name}
                            onChange={controlChange}
                    />
                    {errors.name && <p>{errors.name}</p>}     
                </div>
                <div className="form-group">
                    <label htmlFor="email"
                    className="form-label">
                    Email
                    </label>
                    <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={values.email}
                            onChange={controlChange}
                    />
                    {errors.email && <p>{errors.email}</p>}   
                </div>
                <div className="form-group">
                    <label htmlFor="password"
                    className="form-label">
                    Password
                    </label>
                    <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Choose a password"
                            value={values.password}
                            onChange={controlChange}
                    />
                    {errors.password && <p>{errors.password}</p>}   
                </div>
                <div className="form-group">
                    <label htmlFor="passwordc"
                    className="form-label">
                    Confirm password 
                    </label>
                    <input
                            type="password"
                            name="passwordc"
                            className="form-control"
                            placeholder="Confirm the password"
                            value={values.passwordc}
                            onChange={controlChange}
                    />
                    {errors.passwordc && <p>{errors.passwordc}</p>}   
                </div>
                <Button className = "form-input-button"
                    block size="lg"
                    type="submit">
                    Sign up
                </Button>
                <span className="form-input-login">
                    Already created an account? Login in <a href="/login">here!</a> 
                </span>
            </form>
        </div>
    )
}

export default RegisterSignup
