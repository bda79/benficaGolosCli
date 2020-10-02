import React from 'react';
import './Toolbar.css';
import './MenuToggleButton';
import MenuToggleButton from './MenuToggleButton';
import { MenuItems} from './MenuItems';

const toolbar = props => { 
    return (
    <header className="toolbar">
        <nav className="toolbar_navigation">
            <div className="toolbar_toggle-button">
                <MenuToggleButton click={props.clickHandler}/>
            </div>
            <div className="toolbar_logo" />
            <div className="spacer" />
            <MenuItems user={props.user} logout={props.logout} style={props.styleName}/>
        </nav>
    </header>
)};

export default toolbar;