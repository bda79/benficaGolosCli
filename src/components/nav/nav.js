import React from 'react';
import { Link } from 'react-router-dom';
import Storage from '../../service/StorageData';

const navStyle = {
    color : 'white'
};

export class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
          
          this.setState({user: this.props.user});
        }
      }


    logout = () => {
        Storage.delete('token');
        Storage.clear()
    }

    render() {
        const {user} = this.state;
        const link = user ? `${user} (Log Out)`: 'Log Out';
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
                        <li>{link}</li>
                    </Link>
                </ul>
            </nav>
        );
    }
}