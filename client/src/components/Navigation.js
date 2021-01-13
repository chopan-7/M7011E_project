import React from 'react';
 
import { NavLink } from 'react-router-dom';

var currentPage = window.location.href // current URL for displaying nav-bar
 
const Navigation = () => {
   if(currentPage === 'http://localhost:3000/prosumer/**'){
      return (
         <div>
            <NavLink to="/" style={{ marginRight: 10 }}>Prosumer page start</NavLink>
            <NavLink to="/register" style={{ marginRight: 10 }}>Link2</NavLink>
            <NavLink to="/Login" style={{ marginRight: 10 }}>Link3</NavLink>
         </div>
      );
   } else if ( currentPage === 'http://localhost:3000/manager/**') {
      return (
         <div>
            <NavLink to="/" style={{ marginRight: 10 }}>Manager page start</NavLink>
            <NavLink to="/register" style={{ marginRight: 10 }}>Link2</NavLink>
            <NavLink to="/Login" style={{ marginRight: 10 }}>Link3</NavLink>
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