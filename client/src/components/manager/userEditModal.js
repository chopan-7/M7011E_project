import React, {useState} from 'react'
import {Alert, Button, Container, Modal, Form} from 'react-bootstrap'
import getFromCookie from '../tokenHandler'
const axios = require('axios')

function UserEditModal(props) {
    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        picture: '',
        passwod: '',
        cnfpass: ''
    })
  
    const handleClose = () => {
      setShow(false)
      // clearInterval(jobId)
    };

    const handleShow = () => {
      getUserData()
      setShow(true)
      //setJobId(setInterval(() => {getUserData()}, 5000))  // refresh data every 5 sec
    };

    const handleChange = e => {
      const {name, value} = e.target
      setUserData({
          ...userData,
          [name]: value
      }) 
    }

    const handleSubmit = e => {
      // update userinfo via API
      const getToken = getFromCookie('accessToken')
      axios({
          method: 'POST',
          url: '/api/manager',
          data: {
              query: `mutation {
                updateUser(input: {
                  tokenInput: {access: "${getToken.token}"},
                  id: ${userData.id}
                  name: "${userData.name}"
                  email: "${userData.email}"
                  password: "${userData.password}"
                  picture: "${userData.picture}"
                }) 
                {
                  status
                  message
                }
              }
              `
          }
      })
      // update parent component
      props.onChange(this.userData)
      handleClose()
      e.preventDefault();
    }

    const validate = () => {
      return userData.password !== userData.cnfpass || userData.name < 2
    }
  
    // get user info and data
    const getUserData = () => {
        const getToken = getFromCookie('accessToken')
        var fetchData
        if(props.type==='prosumer') {
          fetchData = axios({
              method: 'post',
              url: '/api/prosumer',
              data: {
                  query: `query {
                      getProsumerInfo(id: ${props.userid}, input: {access: "${getToken.token}"})
                      {
                          id
                          name
                          email
                          picture
                      }
                  }`
              }
          })
        } else {
          fetchData = axios({
              method: 'post',
              url: '/api/manager',
              data: {
                  query: `query {
                    managerInfo(id: ${props.userid}, input: {access: "${getToken.token}"})
                      {
                          id
                          name
                          email
                          picture
                      }
                  }`
              }
          })
        }

        fetchData.then((res) => {
            const info = props.type==='prosumer'?res.data.data.getProsumerInfo:res.data.data.managerInfo
            setUserData({
                id: info.id,
                name: info.name,
                email: info.email,
                picture: info.picture
            })
        })
    }

    return (
      <>
        <Button variant="primary" size="sm" style={{ marginRight: 10 }} onClick={handleShow}>
          Edit / Change password
        </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            <Container>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="fromName">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control type="text" name={'name'} value={userData.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control type="email" name={'email'} value={userData.email} onChange={handleChange}/>
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>New password</Form.Label>
                  <Form.Control type="password" name={'password'} placeholder="Password" onChange={handleChange}/>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Confirm new password</Form.Label>
                  <Form.Control type="password" name={'cnfpass'} placeholder="Password" onChange={handleChange}/>
                  <Alert variant={'danger'} show={userData.password!==userData.cnfpass}>
                    {userData.password!==userData.cnfpass?'New password doesn\'t match':''}
                  </Alert>
                </Form.Group>
                <Button variant="primary" size="sm" type="submit" disabled={validate()}>
                  Save
                </Button>
                <Button variant="secondary" size="sm" style={{marginLeft: 10}}onClick={handleClose}>
                  Cancel
                </Button>
              </Form>
            </Container>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default UserEditModal;