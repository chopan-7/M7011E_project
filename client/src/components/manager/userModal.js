import React, {useState} from 'react'
import {Button, Container, Modal} from 'react-bootstrap'
import {Col, Row} from 'react-bootstrap'
import getFromCookie from '../tokenHandler'
const axios = require('axios')

function UserModal(props) {
    const [show, setShow] = useState(false);
    const [jobId, setJobId] = useState();

    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        role:'',
        state: '',
        online: '',
        production: '',
        consumption: '',
        buffer: '',
        buy_ratio: '',
        sell_ratio: '',
        wind: ''
    })
  
    const handleClose = () => {
      setShow(false)
      clearInterval(jobId)
    };

    const handleShow = () => {
      getUserData()
      setShow(true)
      setJobId(setInterval(() => {getUserData()}, 5000))  // refresh data every 5 sec
    };
  
    // get user info and data
    const getUserData = () => {
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'post',
            url: '/api/prosumer',
            data: {
                query: `query {
                    getProsumerInfo(id: ${props.userid}, input: {access: "${getToken.token}"})
                    {
                        id
                        name
                        email
                        role
                        state
                    }
                    prosumerData(id: ${props.userid}, input: {access: "${getToken.token}"})
                    {
                        production
                        consumption
                        buffer
                        buy_ratio
                        sell_ratio
                        wind
                    }
                }`
            }
        })
        .then((res) => {
            const info = res.data.data.getProsumerInfo
            const data = res.data.data.prosumerData
            setUserData({
                id: info.id,
                name: info.name,
                email: info.email,
                role: info.role,
                state: info.state,
                online: info.online,
                production: data.production.toFixed(2),
                consumption: data.consumption.toFixed(2),
                buffer: data.buffer.toFixed(2),
                buy_ratio: data.buy_ratio.toFixed(2),
                sell_ratio: data.sell_ratio.toFixed(2),
                wind: data.wind.toFixed(2)
            })
        })
    }

    return (
      <>
        <Button variant="primary" size="sm" style={{ marginRight: 10 }} onClick={handleShow}>
          View
        </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>#{props.userid} {userData.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
                <Row>
                    <Col>
                        <p>Production: {userData.production} kWh</p>
                        <p>Consumption: {userData.consumption} kWh</p>
                        <p>Wind: {userData.wind} m/s</p>
                    </Col>
                    <Col>
                        <p>Buffer: {userData.buffer} kWh</p>
                        <p>Buy ratio: {userData.buy_ratio*100} %</p>
                        <p>Sell ratio: {userData.sell_ratio*100} %</p>
                    </Col>
                </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default UserModal;