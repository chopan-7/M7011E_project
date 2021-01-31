import React from 'react'
import getFromCookie from '../tokenHandler'
import {Container, Card, Col, Row, Image} from 'react-bootstrap'
import UserEditModal from './userEditModal'
const axios = require('axios')

class ManagerInfo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: '',
            name: '',
            email: '',
            picture: ''
        }
        this.getUser()
    }

    getUser(){
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'post',
            url: '/api/manager',
            data: {
                query: `query {
                    managerInfo(id: ${getToken.data.userid}, input: {access: "${getToken.token}"}) {
                        id
                        name
                        email
                        picture
                    }
                }`
            }
        })
        .then((res) => {
            const data = res.data.data.managerInfo
            this.setState({
                id: data.id,
                name: data.name,
                email: data.email,
                picture: data.picture
            })
        })
    }

    render() {
        return(
            <>
            <Container fluid>
                <Card id={'overview'}>
                    <Card.Header>Manager info</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <Row>
                                <Col md>
                                    <p>Name: {this.state.name}</p>
                                    <p>Email: {this.state.email}</p>
                                </Col>
                                <Col md>
                                    <Image src={this.state.picture} thumbnail/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <UserEditModal userid={this.state.id} type={'manager'}/>
                                </Col>
                            </Row>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
            </>
        )
    }
}

export default ManagerInfo;