import React from 'react';
import { NavLink } from 'react-router-dom';
import Storage from '../../service/StorageData';

const navStyle = {
    color : 'white'
};

const navigation = (user, logout) => {
    
    const link = user && user.name ? `${user.name} (Log Out)`: 'Log Out';
    
    if(user.isAdmin) {
        return(
            <nav>
                <ul className="nav-links">
                    <NavLink style={navStyle} to='/home' activeClassName="active-link">
                        <li>Home</li>
                    </NavLink>
                    <NavLink style={navStyle} to='/user' activeClassName="active-link">
                        <li>User</li>
                    </NavLink>
                    <NavLink style={navStyle} to='/team' activeClassName="active-link">
                        <li>Team</li>
                    </NavLink>
                    <NavLink style={navStyle} to='/game' activeClassName="active-link">
                        <li>Game</li>
                    </NavLink>
                    <NavLink style={navStyle} to='/season' activeClassName="active-link">
                        <li>Season</li>
                    </NavLink>
                    <NavLink style={navStyle} to='/payment' activeClassName="active-link">
                        <li>Payment</li>
                    </NavLink>
                    <NavLink style={navStyle} to='/login' onClick={logout} activeClassName="active-link">
                        <li>{link}</li>
                    </NavLink>
                </ul>
            </nav>
        )
    }

    return(
        <nav>
            <ul className="nav-links">
                <NavLink style={navStyle} to='/home' activeClassName="active-link">
                    <li>Home</li>
                </NavLink>
                <NavLink style={navStyle} to='/user' activeClassName="active-link">
                    <li>User</li>
                </NavLink>
                <NavLink style={navStyle} to='/login' onClick={logout} activeClassName="active-link">
                    <li>{link}</li>
                </NavLink>
            </ul>
        </nav>
    )
}

export class Nav extends React.Component {

    logout = () => {
        Storage.delete('token');
        Storage.clear()
    }

    render() {
        const user = this.props.user;
        return navigation(user, this.logout)
    }
}