import React from 'react'

import UserTable from '../../components/manager/userTable'

class ManagerUsers extends React.Component{
    
    render() {
        return(
            <div className="Manager">
            <h1>Manager User Settings</h1>
            <UserTable/>
            </div>
        )
    }
}

export default ManagerUsers;