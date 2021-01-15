import React from 'react'
import Navigation from '../../components/Navigation'
import UserTable from '../../components/manager/usertable'

class ManagerUsers extends React.Component{
    
    render() {
        return(
            <div className="Manager">
                <Navigation type="manager" />
                <UserTable/>
            </div>
        )
    }
}

export default ManagerUsers;