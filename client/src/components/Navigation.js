import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <NavLink to="/" style={{ marginRight: 10 }}>Home</NavLink>
          <NavLink to="/register" style={{ marginRight: 10 }}>Register</NavLink>
          <NavLink to="/Login" style={{ marginRight: 10 }}>Login</NavLink>
       </div>
    );
}
 
export default Navigation;