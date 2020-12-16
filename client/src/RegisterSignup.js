import React from "react"
import useRegister from "./useRegister"
import validate from "./validateRegistration"
import "./Register.css"
const RegisterSignup = ({submitRegistration}) => {
    const {controlChange, values, handleSubmit, errors} = useRegister(submitRegistration, validate);
    
    return (
        <div className = "form-how">
            <form className="form" onSubmit={handleSubmit}>
                <h1>
                    Please fill out registration information bellow
                </h1>
                <div className="form-inputs">
                    <label htmlFor="name"
                    className="form-label">
                    Name  
                    </label>
                    <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={values.name}
                            onChange={controlChange}
                    />
                    {errors.name && <p>{errors.name}</p>}     
                </div>
                <div className="form-inputs">
                    <label htmlFor="email"
                    className="form-label">
                    Email
                    </label>
                    <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={values.email}
                            onChange={controlChange}
                    />
                    {errors.email && <p>{errors.email}</p>}   
                </div>
                <div className="form-inputs">
                    <label htmlFor="password"
                    className="form-label">
                    Password
                    </label>
                    <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Choose a password"
                            value={values.password}
                            onChange={controlChange}
                    />
                    {errors.password && <p>{errors.password}</p>}   
                </div>
                <div className="form-inputs">
                    <label htmlFor="passwordc"
                    className="form-label">
                    Confirm password 
                    </label>
                    <input
                            type="password"
                            name="passwordc"
                            className="form-input"
                            placeholder="Confirm the password"
                            value={values.passwordc}
                            onChange={controlChange}
                    />
                    {errors.passwordc && <p>{errors.passwordc}</p>}   
                </div>
                <button className = "form-input-button"
                    type="submit">
                    Sign up
                </button>
                <span className="form-input-login">
                    Already created an account? Login in <a href="#">here</a> 
                </span>
            </form>
        </div>
    )
}

export default RegisterSignup
