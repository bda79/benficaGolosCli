import React from 'react';
import { Link } from 'react-router-dom';

const navStyle = {
    color : 'white'
};

export class Nav extends React.Component {

    logout = () => {
        sessionStorage.setItem('token', '');
        sessionStorage.clear()
    }

    render() {
        return (
            <nav>
                <ul className="nav-links">
                    <Link style={navStyle} to='/home'>
                        <li>Home</li>
                    </Link>
                    <Link style={navStyle} to='/user'>
                        <li>User</li>
                    </Link>
                    <Link style={navStyle} to='/login' onClick={this.logout}>
                        <li>Log Out</li>
                    </Link>
                </ul>
            </nav>
        );
    }
}