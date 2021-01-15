import React from 'react';
 
import { NavLink} from 'react-router-dom';
import { store } from 'react-notifications-component'
import getFromCookie from './tokenHandler'
import {cookies, clearJobsFromCookie} from './cookieHandler'

const axios = require('axios')

const Navigation = (props) => {
   // Navbars for different states
   if(props.type === 'prosumer'){
      return (
         <div>
            <NavLink to="/prosumer" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/prosumer_options" style={{ marginRight: 10 }}>Prosumer options</NavLink>
            <NavLink to="/prosumer_user" style={{ marginRight: 10 }}>User settings</NavLink>
            <NavLink to="/logoff" onClick={() => logoff(props.type)} style={{ marginRight: 10 }}>Logout</NavLink>
         </div>
      );
   } else if ( props.type === 'manager') {
      return (
         <div>
            <NavLink to="/manager" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/manager_users" style={{ marginRight: 10 }}>User settings</NavLink>
            <NavLink to="/logoff" onClick={() => logoff(props.type)} style={{ marginRight: 10 }}>Logout</NavLink>
         </div>
      );
   } else {
      return (
         <div>
            <NavLink to="/" style={{ marginRight: 10 }}>Home</NavLink>
            <NavLink to="/register" style={{ marginRight: 10 }}>Register</NavLink>
            <NavLink to="/login" style={{ marginRight: 10 }}>Prosumer</NavLink>
            <NavLink to="/login_manager" style={{ marginRight: 10 }}>Manager</NavLink>
         </div>
      );
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