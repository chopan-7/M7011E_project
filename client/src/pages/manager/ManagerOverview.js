// Manager overview
import React from 'react'

import Overview from '../../components/manager/overview'
import Controller from '../../components/manager/controller'

class ManagerOverview extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div className="ManagerOverview">
        <Overview />
        <Controller />
      </div>
    );
  }
}

export default ManagerOverview;