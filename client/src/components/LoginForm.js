import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Cookies from 'universal-cookie'
import Alert from 'react-bootstrap/Alert'

import { withRouter, NavLink} from 'react-router-dom'

const cookies = new Cookies()
const axios = require('axios')

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            alert: '',
            alertShow: false,
            alertMessage: ''
        }

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
        // Authenticate user or manager
        const userRole = (window.location.href === 'http://localhost:3000/login_manager')?'manager':'prosumer'
        this.loginUser(this.state.email, this.state.password, userRole).then( (res) => {
            // set cookies
            if(res.tokens != null) {
                cookies.set('accessToken', res.tokens.access, {path: '/'})
                cookies.set('refreshToken', res.tokens.refresh, {path: '/'})
            }

            // render message on fail or redirect on success
            if(res.status === false) {
                this.setState({alert: 'danger', alertShow: true, alertMessage: 'Wrong email or password.'})
            } else {
                if(userRole === 'manager') {
                    this.props.history.push('/manager')    // redirect to manager page
                } else {
                    this.props.history.push('/prosumer')    // redirect to prosumer page
                }
                
            }
        })

        event.preventDefault()

    }

    loginUser(email, password, userRole) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: '/api/'+userRole,
                data: {
                    query: `mutation {
                        authenticate(email: "${email}", password: "${password}") {
                            status
                            tokens {
                                refresh
                                access
                            }
                        }
                    }`
                }
            }).then( (res) => {
                resolve(res.data.data.authenticate)
            }).catch( (err) => {
                if(err){ reject(err)}
            })
        })
    }

    render(){
        const userRole = (window.location.href === 'http://localhost:3000/login_manager')?'manager':'prosumer'
        return (
            <div className="LoginForm">
                <h1>
                    Login page for {userRole}
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control autoFocus type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control autoFocus type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    </Form.Group>
                    <Alert variant={this.state.alert} show={this.state.alertShow} onClick={() => this.setState({alertShow: false})}>
                        {this.state.alertMessage}
                    </Alert>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>Login</Button>
                </Form>
                <NavLink to={userRole==='manager'?'/manager_register':'/register'}>Don't have an account? Sign up here!</NavLink>
            </div>
        )
    }
}

export default withRouter(LoginForm);