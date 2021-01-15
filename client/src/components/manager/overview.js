import React from 'react'
import getFromCookie from '../../components/tokenHandler'
import {addJobToCookie} from '../cookieHandler'
import {Card} from 'react-bootstrap'

const axios = require('axios')

class Overview extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentProduction: '',
            marketDemand: '',
            prosumerOutage: '',
            currentMarketPrice: '',
            buffer: ''
          }

        this.getData()
        var interval_id = window.setInterval(()=>{this.getData()},10000)   // update overview data every 10 sec
        addJobToCookie(interval_id)
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
                        currentProduction
                        marketDemand
                        prosumerOutage
                        currentPrice
                        buffer
                      }
                }`
            }
        })
        .then((response) => {
            const data = response.data.data.managerData
            this.setState({
                currentProduction: data.currentProduction,
                marketDemand: data.marketDemand,
                prosumerOutage: data.prosumerOutage,
                currentMarketPrice: data.currentPrice,
                buffer: data.buffer
            })
        })
    }

    render() {
        return (
          <>
          <Card id={'overview'}>
              <Card.Header>Coal plant overview</Card.Header>
              <Card.Body>
                <Card.Text>
                    <p>State: {this.props.plantState}</p>
                    <p>Current production to market: {this.state.currentProduction}</p>
                    <p>Market demand: {this.state.marketDemand}</p>
                    <p>Prosumer outage: {this.state.prosumerOutage}</p>
                    <p>Current marketprice: {this.state.currentMarketPrice}</p>
                    <p>Buffer: {this.state.buffer}</p>
                </Card.Text>
              </Card.Body>
          </Card>
          </>
        );
      }
}

export default Overview;