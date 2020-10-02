import React from 'react';
import Storage from '../../service/StorageData';
import Toolbar from '../nav/Toolbar/Toolbar';
import SideMenu from '../nav/Toolbar/SideMenu';
import Backdrop from '../Backdrop/Backdrop';

export class Nav extends React.Component {
    state = {menuOpen : false}
    
    logout = () => {
        Storage.delete('token');
        Storage.clear();
        if (this.state.menuOpen) {
            this.setState({menuOpen: false});
        }
    };

    menuToggleClickHandler = () => {
        this.setState((prevState) => {
            return {menuOpen: !prevState.menuOpen}
        })
    };

    backdropClickHandler = () => {
        this.setState({menuOpen: false});
    };

    render() {
        const user = this.props.user;
        let backdrop;
        if (this.state.menuOpen) {
            backdrop = <Backdrop click={this.backdropClickHandler}/>
          }

        return (
            <div style={{height: '60px'}}>
                <Toolbar user={user} logout={this.logout} clickHandler={this.menuToggleClickHandler} styleName="toolbar_navigation-items"/>
                <SideMenu show={this.state.menuOpen} click={this.backdropClickHandler} user={user} logout={this.logout} styleName="side_navigation-items"/>
                {backdrop}
            </div>);
    }
}