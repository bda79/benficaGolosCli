import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom';
import { Home } from '../components/pages/normal/index';
import User from '../components/pages/normal/user';
import Team from '../components/pages/admin/team';
import Championship from '../components/pages/admin/championship';
import Payment from '../components/pages/admin/payment';
import Game from '../components/pages/admin/game';
import Season from '../components/pages/admin/season';
import { Nav } from '../components/nav/index';
import Storage from '../service/StorageData';

export default function AppWrapper() {
    const [user, setUser] = useState({});

    function handleUser(value) {
        if (user.name !== value.name)
            setUser(value);
    }

    function display() {
        const token = Storage.get('token');
        if(!token)
            return (<Redirect to="/login" />);
        
        if (user && !user.name) {
            const cUser = Storage.get('cUser');
            if (cUser)
                setUser(cUser);
        }

        if (user && user.isAdmin) {
            return(
                <div className="App">
                    <Nav user={user}/>
                    <Switch>
                        <Route path='/home' component={()=> <Home onChange={handleUser} /> } />
                        <Route path='/user' component={()=> <User admin={true}/> } />
                        <Route path='/team' component={Team} />
                        <Route path='/championship' component={Championship} />
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
                    <Route path='/user' component={()=> <User admin={false}/> } />
                </Switch>
            </div>
        );

    }
    

    return display();
}