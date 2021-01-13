import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
 
import Start from './pages/Start';
import Register from './pages/Register';
import Login from './pages/Login';
import Manager_Login from './pages/Manager_login';
import Navigation from './components/Navigation';

import ProsumerPage from './pages/prosumer/ProsumerPage';
import ProsumerOptions from './pages/prosumer/ProsumerOptions';
import ProsumerUser from './pages/prosumer/ProsumerUser';

import ManagerPage from './pages/manager/ManagerPage';
import ManagerOptions from './pages/manager/ManagerOptions';
import ManagerUser from './pages/manager/ManagerUser';
 
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
             <Route path="/manager_login" component={Manager_Login} exact/>

             <Route path="/prosumer" component={ProsumerPage} exact/>
             <Route path="/prosumer_options" component={ProsumerOptions} exact/>
             <Route path="/prosumer_user" component={ProsumerUser} exact/>

             <Route path="/manager" component={ManagerPage} exact/>
             <Route path="/manager_options" component={ManagerOptions} exact/>
             <Route path="/manager_user" component={ManagerUser} exact/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;