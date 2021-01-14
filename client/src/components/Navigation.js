import React from 'react';
 
import { NavLink } from 'react-router-dom';

const currentPage = window.location.href.split('/') // current URL for displaying nav-bar
const endPoint = currentPage[currentPage.length - 1].split('_')[0]
 
const Navigation = () => {
   if(endPoint === 'prosumer'){
      return (
         <div>
            <NavLink to="/prosumer" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/prosumer_options" style={{ marginRight: 10 }}>Prosumer options</NavLink>
            <NavLink to="/prosumer_user" style={{ marginRight: 10 }}>User settings</NavLink>
            <NavLink to="/logoff" style={{ marginRight: 10 }}>Logout</NavLink>
         </div>
      );
   } else if ( endPoint === 'manager') {
      return (
         <div>
            <NavLink to="/manager" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/manager_users" style={{ marginRight: 10 }}>User settings</NavLink>
            <NavLink to="/logoff" style={{ marginRight: 10 }}>Logout</NavLink>
         </div>
      );
   } else {
      return (
         <div>
            <NavLink to="/" style={{ marginRight: 10 }}>Home</NavLink>
            <NavLink to="/register" style={{ marginRight: 10 }}>Register</NavLink>
            <NavLink to="/login" style={{ marginRight: 10 }}>Login</NavLink>
         </div>
      );
   }

}
 
export default Navigation;