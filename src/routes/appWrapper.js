import React from 'react'
import { Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom';
import {Home, User} from '../components/pages/index';
import {Nav} from '../components/nav/index';
import Storage from '../service/StorageData';

export class AppWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userName : ''}
        this.handleCUser = this.handleCUser.bind(this);
    }
    
    
    handleCUser(value) {
        if (this.state.userName !== value)
            this.setState({userName: value});
    }

    render(){
        const token = Storage.get('token');
        if(!token)
            return (<Redirect to="/login" />);

        return(
            <div className="App">
                <Nav user={this.state.userName}/>
                <Switch>
                    <Route path='/home' component={() => <Home onChange={this.handleCUser} />} />
                    <Route path='/user' component={() => <User />} />
                </Switch>
            </div>
        );
    }
}