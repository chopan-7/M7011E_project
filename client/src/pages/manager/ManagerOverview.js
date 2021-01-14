import React from 'react'
import Overview from '../../components/manager/overview'
import Controller from '../../components/manager/controller'

class ManagerOverview extends React.Component {
  render() {
    return(
      <div className="ManagerOverview">
      <Controller />
    </div>
    )
  }
}

export default ManagerOverview;