import React from 'react'

import UserTable from '../../components/manager/usertable'

class Manager extends React.Component{
    
    render() {
        return(
            <div className="Manager">
            <h1>Manager page</h1>
            <UserTable/>
            </div>
        )
    }
}

export default Manager;