import React from 'react'
import getFromCookie from '../tokenHandler'
import {Container, Card, Col, Row, Image, Form, Button} from 'react-bootstrap'
import { store } from 'react-notifications-component';
import UserEditModal from './userEditModal'
const axios = require('axios')

class ManagerInfo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: '',
            name: '',
            email: '',
            picture: '',
            newPic: '',
            hideUpload: true
        }
        this.getUser()
        this.uploadPicture = this.uploadPicture.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    uploadPicture(e) {
        const file = e.target.files[0]
        var base64 = this.convertBase64(file)
        base64.then((pic) => {
            this.setState({
                newPic: pic
            }) 
        })
    }

    handleChange(newValues) {
        this.setState({
            name: newValues.name,
            email: newValues.email,
            picture: newValues.picture
        })
    }

    convertBase64(file){
        return new Promise((resolve, reject) =>{
            const readFile = new FileReader()
            readFile.readAsDataURL(file)
            readFile.onload = () => {
                resolve(readFile.result)
            }
            readFile.onerror = (error) => {
                reject(error)
            }
        })
    }

    validateForm(){
        return this.state.newPic.length > 0?true:false
    }
    
    handleSubmit(e) {
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'POST',
            url: '/api/manager',
            data: {
                query: `mutation {
                  updateUser(input: {
                    tokenInput: {access: "${getToken.token}"},
                    id: ${this.state.id},
                    name: "${this.state.name}",
                    email: "${this.state.email}",
                    picture: "${this.state.newPic}"
                  }) 
                  {
                    status
                    message
                  }
                }
                `
            }
        })
        .then((res) => {
            if(res){
                store.addNotification({
                    title: "Saved!",
                    message: "Your new picture has been uploaded to the server.",
                    type: 'success',
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 3000,
                      onScreen: true
                    }
                  })
            }
            this.setState({hideUpload: !this.state.hideUpload})
        })
        e.preventDefault()
    }

    render() {
        return(
            <>
            <Container fluid>
                <Card id={'overview'} style={{marginBottom: 10}}>
                    <Card.Header>Manager info</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <Row>
                                <Col md>
                                    <p>Name: {this.state.name}</p>
                                    <p>Email: {this.state.email}</p>
                                    <Row hidden={this.state.hideUpload} style={{marginLeft: 5}}>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Form.Group>
                                                <Form.File name={'newPic'} accept={'image/*'} onChange={this.uploadPicture} label="Upload new picture" />
                                            </Form.Group>
                                        </Form>
                                    </Row>
                                    <Row>
                                        <Col>
                                        <UserEditModal userid={this.state.id} type={'manager'} onChange={this.handleChange}/>
                                        <Button size="sm" onClick={()=>this.setState({hideUpload: !this.state.hideUpload})} hidden={!this.state.hideUpload}>Update picture</Button>
                                        <Button variant={'primary'} size="sm" disabled={!this.validateForm()} onClick={this.handleSubmit} hidden={this.state.hideUpload}>Save</Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md>
                                    <Row>
                                        <Image src={this.state.newPic?this.state.newPic:this.state.picture} thumbnail/>
                                    </Row>
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