import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom';
import { Home } from '../components/pages/normal/index';
import User from '../components/pages/normal/user';
import Team from '../components/pages/admin/team';
import Championship from '../components/pages/admin/championship';
import Payment from '../components/pages/admin/payment';
import Game from '../components/pages/admin/game';
import Season from '../components/pages/admin/season';
import ServiceData from "../service/dataUtils";
import { Nav } from '../components/nav/index';
import Storage from '../service/StorageData';

export default function AppWrapper() {
    const [user, setUser] = useState({});
    
    useEffect(
        () => {
        let mounted = true;
        
        const loadUser = async () => {
            const token = Storage.get('token');
            const headers = ServiceData.headers(token);
            const options = ServiceData.options('GET', null, headers);
            await ServiceData.execute('users/me', options)
                .then((res) => {
                    if (mounted)
                        setUser(res.data);
                })
                .catch(err => {
                    console.log(err);
                })
        };
        loadUser();

        return () => {
            mounted = false;
        }
    }, []);

    function display() {
        const token = Storage.get('token');
        if(!token)
            return (<Redirect to="/login" />);

        if (user && user.isAdmin) {
            return(
                <div className="App">
                    <Nav user={user}/>
                    <Switch>
                        <Route path='/home' component={()=> <Home /> } />
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
                    <Route path='/home' component={()=> <Home /> } />
                    <Route path='/user' component={()=> <User admin={false}/> } />
                </Switch>
            </div>
        );

    }
    

    return display();
}