import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
 
import Start from './pages/Start';
import Register from './pages/Register';
import Login from './pages/Login';
import Navigation from './components/Navigation';

// Manager components
import Manager from './pages/manager/index'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false
    }
  }

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
             <Route path="/manager/overview" component={Manager} exact />
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;