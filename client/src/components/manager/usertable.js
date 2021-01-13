// Overview page
import React from 'react'
import Cookie from 'universal-cookie'
import jwt from 'jsonwebtoken'


// components
import Table from 'react-bootstrap/Table'

const axios = require('axios')
const cookie = new Cookie()

class UserTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.verifyToken(cookie.get('accessToken')),  // userid from cookie-token
      userList: []
    }

    this.getUsers()

    // update userList every minute
    setInterval(() => {
      this.getUsers()
    }, 60000)
  }

  // get userid from token
  verifyToken(token){
    return jwt.verify(token, "Security is always excessive until it's not enough.").userid
  }

  getUsers(){
      axios({
        method: 'POST',
        url: 'http://localhost:8000/api/prosumer',
        data: {
          query: `query {
            getAllProsumer(input: {access: "${cookie.get('accessToken')}"}){
              id
              name
              email
              role
              state
            }
          }`
        }
      })
      .then((response) => {
        this.setState({userList: response.data.data.getAllProsumer})
      })
  }

  renderUserList(){
    return(
      this.state.userList.map( (user, index) => {
        const {id, name, email, role, state } = user
        return(
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{role}</td>
            <td>{state}</td>
          </tr>
        )
      })
    )
  }

  render() {
    return (
      <div className="ManagerPage">
      <h1>Manager overview</h1>
      <Table stripped bordered hover id={this.userList}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>State</th>
          </tr>
          {this.renderUserList()}
        </thead>
      </Table>
      </div>
    );
  }
}

export default UserTable;