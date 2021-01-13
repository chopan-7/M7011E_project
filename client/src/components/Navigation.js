import React from 'react';
 
import { NavLink } from 'react-router-dom';

var currentPage = window.location.href // current URL for displaying nav-bar
 
const Navigation = () => {
   if(currentPage === 'http://localhost:3000/prosumer'){
      return (
         <div>
            <NavLink to="/prosumer" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/prosumer_options" style={{ marginRight: 10 }}>Prosumer options</NavLink>
            <NavLink to="/prosumer_user" style={{ marginRight: 10 }}>User settings</NavLink>
         </div>
      );
   } else if ( currentPage === 'http://localhost:3000/manager') {
      return (
         <div>
            <NavLink to="/manager" style={{ marginRight: 10 }}>Overview</NavLink>
            <NavLink to="/manager_options" style={{ marginRight: 10 }}>Manager options</NavLink>
            <NavLink to="/manager_user" style={{ marginRight: 10 }}>User settings</NavLink>
         </div>
      );
   } else {
      return (
         <div>
            <NavLink to="/" style={{ marginRight: 10 }}>Home</NavLink>
            <NavLink to="/register" style={{ marginRight: 10 }}>Register</NavLink>
            <NavLink to="/Login" style={{ marginRight: 10 }}>Login</NavLink>
         </div>
      );
   }

}
 
export default Navigation;