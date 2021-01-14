import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
 
import Start from './pages/Start';
import Register from './pages/Register';
import Login from './pages/Login';
import Navigation from './components/Navigation';


// Manager components
import ManagerOverview from './pages/manager/ManagerOverview';
import ManagerUsers from './pages/manager/ManagerUsers'

import ProsumerPage from './pages/prosumer/ProsumerPage';
import ProsumerOptions from './pages/prosumer/ProsumerOptions';
import ProsumerUser from './pages/prosumer/ProsumerUser';

 

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
             <Route path="/login_manager" component={Login} exact/>

             <Route path="/prosumer" component={ProsumerPage} exact/>
             <Route path="/prosumer_options" component={ProsumerOptions} exact/>
             <Route path="/prosumer_user" component={ProsumerUser} exact/>

             <Route path="/manager" component={ManagerOverview} exact/>
             <Route path="/manager_users" component={ManagerUsers} exact />
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;