import React from 'react'
import Controller from '../../components/manager/controller'
import ManagerInfo from '../../components/manager/managerInfo'
import Navigation from '../../components/Navigation'

class ManagerOverview extends React.Component {
  render() {
    return(
      <div className="ManagerOverview">
        <Navigation type="manager" />
        <Controller />
        <ManagerInfo />
    </div>
    )
  }
}

export default ManagerOverview;