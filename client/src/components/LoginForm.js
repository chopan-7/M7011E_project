import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { email: '', password: ''}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit(event) {
        /*
        TODO:
            - Send email and password for authentication on the prosumer API
            - On success, tokens for access and refresh will be received, put these in cookie.
            - Render a fail- or success message and redirect to user page
        */
        alert("You submitted email: "+ this.state.email + " and password: " + this.state.password)

        

        event.preventDefault()
    }

    render(){
        return (
            <div className="LoginForm">
                <h1>
                    Login page
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group sige="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control autoFocus type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group sige="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control autoFocus type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>Login</Button>
                </Form>
            </div>
        )
    }
}

export default LoginForm;