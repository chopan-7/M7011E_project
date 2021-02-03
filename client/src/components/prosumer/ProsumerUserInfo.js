import {useState, useEffect} from 'react'
import getFromCookie from '../tokenHandler'
import axios from "axios"
import {Card, Button, Container, Form, Row, Col, Image} from 'react-bootstrap'
import { store } from 'react-notifications-component';
import UserEditModal from '../manager/userEditModal'

const ProsumerUserInfo = () =>{

    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('');

    const [newPic, setNewPic] = useState('');
    const [hideUpload, setHideUpload] = useState(true);

    const uploadPicture = async e =>{
        const file = e.target.files[0]
        const base64 = await convertBase64(file)
        setNewPic(base64)
    }

    const convertBase64 = (file) => {
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

    const validateForm = () => {
        return newPic.length > 0?true:false
    }

    const handleSubmit = (e) => {
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'post',
            url: '/api/prosumer',
            data: {
                query: `mutation {
                    updatePicture(picture: "${newPic}", input: {access: "${getToken.token}"})
                }`
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
        })
        e.preventDefault()
    }
    

    useEffect(() => { 
        getUser()
    }, [])

    const getUser= () => {
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'post',
            url: '/api/prosumer',
            data: {
                query: `query{
                    getProsumerInfo(id:${getToken.data.userid}, input:{
                        access:"${getToken.token}"
                    }){
                        id
                        name
                        email
                        picture
                    }
                }`
            }
        })
        .then((response) => {
            const data = response.data.data.getProsumerInfo 
            setUserId(data.id)
            setName(data.name)
            setEmail(data.email)
            setPicture(data.picture)
        })
    }
   
    
    return (
        <>
        <Container fluid>
            <Card>
                <Card.Header>
                    My profile page
                </Card.Header>
                {/* <Card.Img variant="top" src={newPic?newPic:picture}/> */}
                <Card.Body>
                    <Row>
                        <Col>
                            <Image src={newPic?newPic:picture} thumbnail/>
                        </Col>
                        <Col>
                            <Card.Title>{name}</Card.Title>
                            <Card.Text>
                                <p>Email: {email} </p>
                            </Card.Text>
                            <Form onSubmit={handleSubmit} hidden={hideUpload}>
                                <Form.Group>
                                    <Form.File name={'newPic'} accept={'image/*'} onChange={uploadPicture} label="Upload new picture" />
                                </Form.Group>
                                {/* <Button type={'submit'} variant={'primary'} disabled={!validateForm()}>Save</Button> */}
                            </Form>
                            <UserEditModal userid={userId} type={'prosumer'}/>
                            <Button hidden={hideUpload===false} size="sm" onClick={() => {
                                setHideUpload(!hideUpload)
                                }}>Upload new picture</Button>
                            <Button hidden={hideUpload} size="sm" onClick={handleSubmit} variant={'primary'} disabled={!validateForm()}>Save</Button>
                            <Button hidden={hideUpload} size="sm" onClick={() => setHideUpload(!hideUpload)} variant={'secondary'} style={{marginLeft: 10}}>Cancel</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
        </>
    )
}

export default ProsumerUserInfo