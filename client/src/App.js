import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
 
import Start from './pages/Start';
import Register from './pages/Register';
import Login from './pages/Login';
import Navigation from './components/Navigation';
 
class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
          <Navigation />
            <Switch>
             <Route path="/" component={Start} exact/>
             <Route path="/register" component={Register} exact/>
             <Route path="/login" component={Login} exact/>
             <Route path="/manager_register" component={Register} exact/>
             <Route path="/manager_login" component={Login} exact/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;