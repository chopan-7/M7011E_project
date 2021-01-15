import React from 'react';
 
import { NavLink} from 'react-router-dom';
import { store } from 'react-notifications-component'
import getFromCookie from './tokenHandler'
import {cookies, clearJobsFromCookie} from './cookieHandler'

var currentPage = window.location.href.split('/') // current URL for displaying nav-bar
var endPoint = currentPage[currentPage.length - 1].split('_')[0]
const axios = require('axios')


 
const Navigation = () => {
   if(endPoint === 'prosumer'){
      return (
         <div>
            <NavLink to="/prosumer" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/prosumer_options" style={{ marginRight: 10 }}>Prosumer options</NavLink>
            <NavLink to="/prosumer_user" style={{ marginRight: 10 }}>User settings</NavLink>
            <NavLink to="/logoff" onClick={logoff} style={{ marginRight: 10 }}>Logout</NavLink>
            {endPoint}
         </div>
      );
   } else if ( endPoint === 'manager') {
      return (
         <div>
            <NavLink to="/manager" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/manager_users" style={{ marginRight: 10 }}>User settings</NavLink>
            <NavLink to="/logoff" onClick={logoff} style={{ marginRight: 10 }}>Logout</NavLink>
            {endPoint}
         </div>
      );
   } else {
      return (
         <div>
            <NavLink to="/" style={{ marginRight: 10 }}>Home</NavLink>
            <NavLink to="/register" style={{ marginRight: 10 }}>Register</NavLink>
            <NavLink to="/login" style={{ marginRight: 10 }}>Login</NavLink>
            {endPoint}
         </div>
      );
   }

}

const logoff = () => {
   // stop all intervals
   clearJobsFromCookie()
   
   // window.clearInterval(updateOverview)

   // sign off user
   const getToken = getFromCookie('accessToken')
   axios({
      method: 'post',
      url: 'http://localhost:8000/api/'+endPoint,
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