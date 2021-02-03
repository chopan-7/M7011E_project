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
            buffer: '',
            suggestedPrice: ''
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
            url: '/api/manager',
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
                currentProduction: data.currentProduction.toFixed(2),
                marketDemand: data.marketDemand.toFixed(2),
                prosumerOutage: data.prosumerOutage,
                currentMarketPrice: data.currentPrice.toFixed(2),
                buffer: data.buffer.toFixed(2)
            })
        })
        axios({
            method: 'POST',
            url: '/api/simulator',
            data: {
                query: `query {
                    simulate{
                      suggestedPrice
                    }
                  }`
            }
        })
        .then((res) => {
            const data = res.data.data.simulate
            this.setState({suggestedPrice: data.suggestedPrice.toFixed(2)})
        })
    }

    render() {
        return (
          <>
          <Card id={'overview'}>
              <Card.Header>Coal plant overview</Card.Header>
              <Card.Body>
                <Card.Text>
                    <h3>Coal plant status</h3>
                    <p>State: {this.props.plantState}</p>
                    <p>Buffer: {this.state.buffer} kwh</p>
                    <p>Current production to market: {this.state.currentProduction} kwh</p>

                    <h3>Market status</h3>
                    <p>Market demand: {this.state.marketDemand} kwh</p>
                    <p>Prosumer outage: {this.state.prosumerOutage}</p>
                    <p>Current marketprice: {this.state.currentMarketPrice} kr</p>
                    <p>Suggested marketprice: {this.state.suggestedPrice} kr</p>
                </Card.Text>
              </Card.Body>
          </Card>
          </>
        );
      }
}

export default Overview;