// Overview page
import React from 'react'
import {Container, Card, Button, Badge} from 'react-bootstrap'
import getFromCookie from '../tokenHandler'
import { store } from 'react-notifications-component';
import UserModal from './userModal'
import DeleteUserBtn from './userDelete'
import {addJobToCookie} from '../cookieHandler'


// components
import Table from 'react-bootstrap/Table'

const axios = require('axios')

class UserTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: [],
      userData: []
    }

    this.getUsers()

    // update userList every 5 seconds
    addJobToCookie(
      setInterval(() => {
        this.getUsers()
      }, 5000)
    )
  }


  getUsers(){
      const getToken = getFromCookie('accessToken')
      axios({
        method: 'POST',
        url: '/api/prosumer',
        data: {
          query: `query {
            getAllProsumer(input: {access: "${getToken.token}"}){
              id
              name
              email
              role
              state
              online
            }
          }`
        }
      })
      .then((response) => {
        this.setState({userList: response.data.data.getAllProsumer})
      })
  }

  blockUser(id) {
    const getToken = getFromCookie('accessToken')

    // Send block request to API and notify user
    store.addNotification({
      title: "Blocking...",
      message: "Blocking user id "+id+" from selling electricity.",
      type: "warning",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 30000,
        onScreen: true
      }
    })

    axios({
      method: 'POST',
      url: '/api/manager',
      data: {
        query: `mutation {
          blockUser(id: ${id}, time: 30000, input: {access: "${getToken.token}"}){
            status
            message
          }
        }`
      }
    }).then((response) => {
      const res = response.data.data.blockUser
      // notify once response is received
      store.addNotification({
        title: "Done!",
        message: res.message,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      })
    })
  }

  renderUserList(){
    return(
      this.state.userList.map( (user, index) => {
        const {id, name, email, role, state, online } = user
        return(
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{role}</td>
            <td>{state}</td>
            <td><Badge pill variant={online===true?'success':'secondary'}>{online===true?'Online':'Offline'}</Badge></td>
            <td>
              <UserModal userid={id}/>
              <Button variant="warning" size="sm" style={{ marginRight: 10 }} onClick={() => this.blockUser(id)}>Block</Button>
              <DeleteUserBtn userid={id} />
            </td>
          </tr>
        )}
    ))
  }

  render() {
    return (
      <>
      <Container fluid>
      <Card id={'userList'}>
      <Card.Header>Users</Card.Header>
        <Card.Body>
          <Table striped bordered hover size={'sm'}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>State</th>
                <th>Online</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.renderUserList()}
          </Table>
        </Card.Body>
      </Card>
      </Container>
      </>
    );
  }
}

export default UserTable;