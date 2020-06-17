import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom';
import { Home, User } from '../components/pages/normal/index';
import {Team, Game, Payment, Season } from '../components/pages/admin/index';
import { Nav } from '../components/nav/index';
import Storage from '../service/StorageData';

export default function AppWrapper() {
    const [user, setUser] = useState({});

    function handleUser(value) {
        if (user.name !== value.name)
            setUser(value);
    }

    function display() {
        console.log("W Render");
        const token = Storage.get('token');
        if(!token)
            return (<Redirect to="/login" />);
        
        if (user && user.isAdmin) {
            return(
                <div className="App">
                    <Nav user={user}/>
                    <Switch>
                        <Route path='/home' component={()=> <Home onChange={handleUser} /> } />
                        <Route path='/user' component={User} />
                        <Route path='/team' component={Team} />
                        <Route path='/game' component={Game} />
                        <Route path='/payment' component={Payment} />
                        <Route path='/season' component={Season} />
                    </Switch>
                </div>
            );
        }
        
        return(
            <div className="App">
                <Nav user={user}/>
                <Switch>
                    <Route path='/home' component={()=> <Home onChange={handleUser} /> } />
                    <Route path='/user' component={User} />
                </Switch>
            </div>
        );

    }
    

    return display();
}