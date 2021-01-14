import React from 'react'

class Overview extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            plantState: '',
            marketDemand: '',
            prosumerOutage: '',
            currentMarketPrice: ''
          }
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
            </div>
          </div>
        );
      }
}

export default Overview;