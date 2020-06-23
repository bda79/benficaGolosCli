import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Login} from '../components/login/login';
import {Forgot} from '../components/login/forgot';
import {Reset} from '../components/login/reset';
import AppWrapper from './routeWrapper';

export class AllRoutes extends React.Component {
    render(){
      return(
        <Router>
            <Switch>
               <Route path="/login" exact component={Login} />
               <Route path="/forgot" exact component={Forgot} />
               <Route path="/reset/:token" component={Reset} />
               <Route path="/" component={AppWrapper} />
            </Switch>
        </Router>
      );
     }
}