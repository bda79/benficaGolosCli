import React from 'react';
import './SideMenu.css';
import { MenuItems} from './MenuItems';

const sideMenu = props => {
    let menuClass = 'side-menu';
    if (props.show) {
        menuClass = 'side-menu open';
    }
    return (
    <nav className={menuClass}>
       <MenuItems user={props.user} click={props.click} logout={props.logout} style={props.styleName} />
    </nav>
)};

export default sideMenu;