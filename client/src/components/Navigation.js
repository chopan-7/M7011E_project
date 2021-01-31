import React from 'react';
import {Navbar, Nav} from 'react-bootstrap' 
import { store } from 'react-notifications-component'
import getFromCookie from './tokenHandler'
import {cookies, clearJobsFromCookie} from './cookieHandler'

const axios = require('axios')

const Navigation = (props) => {
   // Navbars for different states
   if(props.type === 'prosumer'){
      return(
         <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/prosumer">Greenlight simulator</Navbar.Brand>
            <Nav.Link href="/prosumer" style={{ marginRight: 10 }}>Overview</Nav.Link>
            <Nav.Link href="/prosumer_user" style={{ marginRight: 10 }}>User settings</Nav.Link>
            <Nav.Link href="/logoff" onClick={() => logoff(props.type)} style={{ marginRight: 10 }}>Logout</Nav.Link>
         </Navbar>
      )
   } else if ( props.type === 'manager') {
      return(
         <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/manager">Greenlight simulator</Navbar.Brand>
            <Nav.Link href="/manager" style={{ marginRight: 10 }}>Overview</Nav.Link>
            <Nav.Link href="/manager_users" style={{ marginRight: 10 }}>User settings</Nav.Link>
            <Nav.Link href="/logoff" onClick={() => logoff(props.type)} style={{ marginRight: 10 }}>Logout</Nav.Link>
         </Navbar>
      )
   } else {
      return(
         <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Greenlight simulator</Navbar.Brand>
            <Nav.Link href="/" style={{ marginRight: 10 }}>Home</Nav.Link>
            <Nav.Link href="/register" style={{ marginRight: 10 }}>Register</Nav.Link>
            {/* <Nav.Link href="/manager_register" style={{ marginRight: 10 }}>Register manager</Nav.Link> */}
            <Nav.Link href="/login" style={{ marginRight: 10 }}>Prosumer</Nav.Link>
            <Nav.Link href="/login_manager" style={{ marginRight: 10 }}>Manager</Nav.Link>
         </Navbar>
      )
   }
}

// Sign out function
const logoff = (from) => {
   // stop all intervals
   clearJobsFromCookie()
   // sign off user
   const getToken = getFromCookie('accessToken')
   axios({
      method: 'post',
      url: 'http://localhost:8000/api/'+from,
      data: {
         query: `mutation {
            signOut(input: {access: "${getToken.token}"}){
               status
               message
               tokens {
                  access
                  refresh
               }
            }
         }`
      }
   }).then((res) => {
      // update cookie to invalid
      const resData = res.data.data.signOut
      if(resData.tokens != null) {
         
         cookies.set('accessToken', resData.tokens.access, {path: '/'})
         cookies.set('refreshToken', resData.tokens.refresh, {path: '/'})
     }

      store.addNotification({
         title: "Bye",
         message: "Logging off!",
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
 
export default Navigation;