import React from 'react'
// import Overview from '../../components/manager/overview'
import Controller from '../../components/manager/controller'
import Navigation from '../../components/Navigation'

class ManagerOverview extends React.Component {
  render() {
    return(
      <div className="ManagerOverview">
        <Navigation type="manager" />
        <Controller />
    </div>
    )
  }
}

export default ManagerOverview;