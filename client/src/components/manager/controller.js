import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import getFromCookie from '../tokenHandler'

const axios = require('axios')


class Controller extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            buffer_value: '',
            buffer_ratio: '',
            production_state: '',
            marketPrice: ''
        }
        this.getData()

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleStartStop(event){

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit(event) {

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
                        buffer
                        bufferRatio
                      }
                }`
            }
        })
        .then((response) => {
            const data = response.data.data.managerData
            this.setState({
                production_state: data.state,
                buffer_value: data.buffer,
                buffer_ratio: data.bufferRatio
            })
        })
    }

    render() {
        return(
            <div className={Controller}>
                <h3>Controller</h3>
                <div class="controll_display">
                    <p>Buffer: {this.state.buffer_value}</p>
                </div>
                <div class="controll_panel">
                <Form>
                    <Form.Group controlId="buffer_ratio">
                        <Form.Label>Buffer ratio: {this.state.buffer_ratio}</Form.Label>
                        <Form.Control type="range" name="buffer_ratio" min="0" max="1" step="0.01" value={this.state.buffer_ratio} onChange={e => this.setState({buffer_ratio: e.target.value})} custom/>
                    </Form.Group>
                    <Form.Group controlId="setMarketPrice">
                        <Form.Label>Set marketprice:</Form.Label>
                        
                    </Form.Group>
                    <Button variant="primary">Start production</Button>
                    <Button variant="danger">Stop production</Button>
                    <br/>
                    <Button variant="primary" type="submit">Save settings</Button>
                </Form>
                </div>
            </div>
        )
    }
}

export default Controller;