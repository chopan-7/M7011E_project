import React from 'react'
import { Form } from 'react-bootstrap'
import getFromCookie from '../tokenHandler'

const axios = require('axios')

class Overview extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            plantState: '',
            marketDemand: '',
            prosumerOutage: '',
            currentMarketPrice: '',
            buffer: '',
            buffer_ratio: ''
          }

        this.getData()
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
                        marketDemand
                        prosumerOutage
                        currentPrice
                        bufferRatio
                      }
                }`
            }
        })
        .then((response) => {
            const data = response.data.data.managerData
            this.setState({
                plantState: data.state,
                marketDemand: data.marketDemand,
                prosumerOutage: data.prosumerOutage,
                currentMarketPrice: data.currentPrice,
                buffer_ratio: data.buffer_ratio
            })
        })
    }

    render() {
        return (
          <div className="ManagerOverview">
            <div className="Overview">
              <h3>Overview</h3>
              <p>Coal plant state: {this.state.plantState}</p>
              <p>Market demand: {this.state.marketDemand}</p>
              <p>Prosumer outage: {this.state.prosumerOutage}</p>
              <p>Current marketprice: {this.state.currentMarketPrice}</p>
              <p>Buffer ratio: {this.state.buffer_ratio}</p>
            </div>
          </div>
        );
      }
}

export default Overview;