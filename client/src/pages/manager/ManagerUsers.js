import React from 'react'
import Navigation from '../../components/Navigation'
import UserTable from '../../components/manager/usertable'
import UserOverview from '../../components/manager/userOverview'

class ManagerUsers extends React.Component{
    
    render() {
        return(
            <div className="Manager">
                <Navigation type="manager" />
                <UserOverview />
                <UserTable/>
            </div>
        )
    }
}

export default ManagerUsers;