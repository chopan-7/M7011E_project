import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import getFromCookie from '../tokenHandler'

import Overview from './overview'

import { store } from 'react-notifications-component';

const axios = require('axios')


class Controller extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            buffer_ratio: '',
            production_state: '',
            marketPrice: '',
            alert: '',
            alertShow: false,
            alertMessage: ''
        }
        this.getData()

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleStartStop(){
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/manager',
            data: {
                query: `mutation{
                    startProduction(id: ${getToken.data.userid}, input: {access: "${getToken.token}"}){
                      status
                      message
                    }
                  }`
            }
        })
        .then((response) => {
            const res = response.data.data.startProduction
            if(res.status === true){
                var changeType
                if(this.state.production_state === 0) {
                    changeType = 'success'
                    this.setState({production_state: 1})
                } else {
                    changeType = 'danger'
                    this.setState({production_state: 1})
                }
                // const changeType = this.state.production_state === 0?'success':'danger'
                store.addNotification({
                    title: "Success!",
                    message: res.message,
                    type: changeType,
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 30000,
                      onScreen: true
                    }
                  })
            } else {
                store.addNotification({
                    title: "Something went wrong!",
                    message: res.message,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 30000,
                      onScreen: true
                    }
                  })
            }

            setTimeout( () => (
                window.location.reload()
            ), 30000)
        })

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit(event) {
        // validate ratio value
        if(this.state.buffer_ratio > 100) {
            this.setState({
                alert: 'danger',
                alertShow: true,
                alertMessage: 'Buffer ratio must be <= 100'
            })
        }

        // update value via API
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/manager',
            data: {
                query: `mutation {
                    setBufferRatio(id: ${getToken.data.userid}, ratio: ${this.state.buffer_ratio/100}, input: {access: "${getToken.token}"}) {
                        status
                    }
                    setCurrentPrice(id: ${getToken.data.userid}, price: ${this.state.marketPrice}, input: {access: "${getToken.token}"}){
                        status
                    }
                }
                `
            }
        })
        .then((response) => {
            const res = response.data.data
            const status = res.setBufferRatio.status === res.setCurrentPrice.status?true:false
            if(!status) {
                // fail
            } else {
                // success
                setTimeout(() => {
                    window.location.reload()
                },2000)
                store.addNotification({
                    title: "Success!",
                    message: "Saving settings!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                  })
            }
        })

        event.preventDefault()
    }

    getData() {
        const getToken = getFromCookie('accessToken') // cookie-token
        
        // fetch data form API
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/manager',
            data: {
                query: `query {
                    managerData(input: {access: "${getToken.token}"}) {
                        state
                        currentPrice
                        bufferRatio
                      }
                }`
            }
        })
        .then((response) => {
            const data = response.data.data.managerData
            this.setState({
                production_state: data.state,
                buffer_ratio: data.bufferRatio*100,
                marketPrice: data.currentPrice
            })
        })
    }

    render() {
        return(
            <div className={Controller}>
                <Overview plantState={this.state.production_state} currentPrice={this.state.marketPrice}/>
                <h3>Controller</h3>
                <div class="controll_panel">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Form.Col} controlID="formGridBuffer_ratio">
                        <Form.Label>Buffer ratio %: </Form.Label>
                            <Form.Control type="percent" name="buffer_ratio" size="sm" value={this.state.buffer_ratio} onChange={this.handleChange}/>
                            <Form.Control type="range" name="buffer_ratio" size="sm" min="0" max="100" value={this.state.buffer_ratio} step="0.01" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group as={Form.Col} controlId="marketPrice">
                            <Form.Label>Set marketprice:</Form.Label>
                            <Form.Control type="text" name="marketPrice" size="sm" value={this.state.marketPrice} onChange={this.handleChange}/>
                    </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button variant="primary" type="submit">Save settings</Button>
                    </Form.Row>
                    <Alert variant={this.state.alert} show={this.state.alertShow} onClick={() => this.setState({alertShow: false})}>
                        {this.state.alertMessage}
                    </Alert>
                </Form>
                <Button variant={this.state.production_state === 0?'success':'danger'} onClick={() => this.handleStartStop()}>{this.state.production_state === 0?'Start production':'Stop production'}</Button>
                </div>
            </div>
        )
    }
}

export default Controller;