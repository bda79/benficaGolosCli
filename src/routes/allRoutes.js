import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Login} from '../components/login/login';
import {AppWrapper} from './appWrapper';

export class AllRoutes extends React.Component {
    render(){
      return(
        <Router>
            <Switch>
               <Route path="/login" exact component={Login} /> 
               <Route path="/" component={AppWrapper} />
            </Switch>
        </Router>
      );
     }
}