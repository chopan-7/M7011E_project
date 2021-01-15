import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css'
 
import Start from './pages/Start';
import Register from './pages/Register';
import Login from './pages/Login';


// Manager components
import ManagerOverview from './pages/manager/ManagerOverview';
import ManagerUsers from './pages/manager/ManagerUsers'

import ProsumerPage from './pages/prosumer/ProsumerPage';
import ProsumerUser from './pages/prosumer/ProsumerUser';

 

class App extends Component {

  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={Start} exact/>
             <Route path="/register" component={Register} />
             <Route path="/login" component={Login} exact/>
             <Route path="/manager_register" component={Register} />
             <Route path="/login_manager" component={Login} />

             <Route path="/prosumer" component={ProsumerPage} exact/>
             <Route path="/prosumer_user" component={ProsumerUser} />

             <Route path="/manager" component={ManagerOverview} exact/>
             <Route path="/manager_users" component={ManagerUsers}  />
             <Route exact path="/logoff">
               <Redirect render={Start}/>
             </Route>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;