import React from 'react'
import { Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom';
import {Home, User} from '../components/pages/index';
import {Nav} from '../components/nav/index';

export class AppWrapper extends React.Component{
  render(){
    if(!sessionStorage.getItem('token'))
        return <Redirect to="/login" />

   return(
    <div className="App">
        <Nav />
        <Switch>
            <Route path='/home' component={Home}/>
            <Route path='/user' component={User}/>
        </Switch>
    </div>
   );
  }
}