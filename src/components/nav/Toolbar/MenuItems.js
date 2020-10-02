import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
    {
        title: 'Home',
        isAdmin: false,
        link: '/home',
        style: 'active-link'
    },
    {
        title: 'User',
        isAdmin: false,
        link: '/user',
        style: 'active-link'
    },
    {
        title: 'Team',
        isAdmin: true,
        link: '/team',
        style: 'active-link'
    },
    {
        title: 'Championship',
        isAdmin: false,
        link: '/championship',
        style: 'active-link'
    },
    {
        title: 'Game',
        isAdmin: false,
        link: '/game',
        style: 'active-link'
    },
    {
        title: 'Season',
        isAdmin: false,
        link: '/season',
        style: 'active-link'
    },
    {
        title: 'Payment',
        isAdmin: false,
        link: '/payment',
        style: 'active-link'
    }
]

export const MenuItems = props => {
    const {user, logout} = props;
    
    const link = user && user.name ? `${props.user.name} (Log Out)`: 'Log Out';
    const count = items.length + 1;

    const clickHandler = () => {
        if (props.click) {
            props.click();
        }
    }
    
    if (user.isAdmin) {
        return (
            <div className={props.style}>
                <ul className="nav-links">
                    { items.map((item, index) => {
                        return (
                            <NavLink key={index} to={item.link} onClick={clickHandler} activeClassName={item.style}>
                                <li>{item.title}</li>
                            </NavLink>
                        )})
                    }
                    <NavLink key={count} to='/login' onClick={logout} activeClassName="active-link">
                        <li>{link}</li>
                    </NavLink>
                </ul>
            </div>
        )
    }

    return (
        <div className={props.style}>
            <ul className="nav-links">
                { items.filter(i => !i.isAdmin).map((item, index) => {
                        return (
                            <NavLink key={index} to={item.link} onClick={clickHandler} activeClassName={item.style}>
                                <li>{item.title}</li>
                            </NavLink>
                        )})
                }
                <NavLink key={count} to='/login' onClick={logout} activeClassName="active-link">
                    <li>{link}</li>
                </NavLink>
            </ul>
        </div>
    )
};