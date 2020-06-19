import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Storage from '../../service/StorageData';
import "./style.scss";

const navStyle = {
    color : 'white'
};

const navigation = (user, logout) => {
    const link = user && user.name ? `${user.name} (Log Out)`: 'Log Out';
    if(user.isAdmin) {
        return(
            <nav>
                <ul className="nav-links">
                    <Link style={navStyle} to='/home'>
                        <li>Home</li>
                    </Link>
                    <Link style={navStyle} to='/user'>
                        <li>User</li>
                    </Link>
                    <Link style={navStyle} to='/team'>
                        <li>Team</li>
                    </Link>
                    <Link style={navStyle} to='/game'>
                        <li>Game</li>
                    </Link>
                    <Link style={navStyle} to='/season'>
                        <li>Season</li>
                    </Link>
                    <Link style={navStyle} to='/payment'>
                        <li>Payment</li>
                    </Link>
                    <Link style={navStyle} to='/login' onClick={logout}>
                        <li>{link}</li>
                    </Link>
                </ul>
            </nav>
        )
    }

    return(
        <nav>
            <ul className="nav-links">
                <Link style={navStyle} to='/home'>
                    <li>Home</li>
                </Link>
                <Link style={navStyle} to='/user'>
                    <li>User</li>
                </Link>
                <Link style={navStyle} to='/login' onClick={logout}>
                    <li>{link}</li>
                </Link>
            </ul>
        </nav>
    )
}

const Nav = props => {
    const [user, setUser] = useState(props.user);

    useEffect(
        () => {
          setUser(props.user);
        },
        [ props ]
    );

    const logout = () => {
        Storage.delete('token');
        Storage.clear()
    }

    return navigation(user, logout);
}

export default Nav;