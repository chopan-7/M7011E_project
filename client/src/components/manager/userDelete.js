import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import { store } from 'react-notifications-component';

import getFromCookie from '../tokenHandler'
const axios = require('axios')


const DeleteUserBtn = (props) => {

    const handleDelete = () => {
        const getToken = getFromCookie('accessToken')
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/manager',
            data: {
                query: `mutation {
                    deleteUser(id: ${props.userid}, input: {access: "${getToken.token}"}){
                        status
                        message
                    }
                }`
            }
        })
        .then((response) => {
            const resData = response.data.data.deleteUser
            var message
            if(resData.status){
                message = 'User '+props.userid+' has beend deleted from the database.'
            } else {
                message = 'Fail to delete user from the database'
            }
            store.addNotification({
                title: resData.status?'Success':'Fail',
                message: message,
                type: resData.status?'success':'danger',
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

    return(
        <>
        <Button variant="danger" size="sm" style={{ marginRight: 10 }} onClick={handleDelete}>
          Delete
        </Button>
        </>
    )
}

export default DeleteUserBtn;