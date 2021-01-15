import {useState, useEffect} from 'react'
import getFromCookie from '../tokenHandler'
import axios from "axios"
import {Card, Button, Container, Form} from 'react-bootstrap'
import { store } from 'react-notifications-component';

const ProsumerUserInfo = () =>{

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('');

    const [newPic, setNewPic] = useState('');

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
            url: 'http://localhost:8000/api/prosumer',
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
            url: 'http://localhost:8000/api/prosumer',
            data: {
                query: `query{
                    getProsumerInfo(id:${getToken.data.userid}, input:{
                        access:"${getToken.token}"
                    }){
                        name
                        email
                        picture
                    }
                }`
            }
        })
        .then((response) => {
            const data = response.data.data.getProsumerInfo 
            setName(data.name)
            setEmail(data.email)
            setPicture(data.picture)
        })
    }
   
    
    return (
        <>
        <Container fluid>
            <Card style={{ width: '50%' }}>
                <Card.Img variant="top" src={newPic?newPic:picture} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        <p>Email: {email} </p>
                    </Card.Text>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.File name={'picture'} accept={'image/*'} onChange={uploadPicture} label="Upload new picture" />
                        </Form.Group>
                        <Button type={'submit'} variant={'primary'} disabled={!validateForm()}>Save</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </>
    )
}

export default ProsumerUserInfo