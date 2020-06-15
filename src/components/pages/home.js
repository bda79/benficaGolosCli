import React from "react";
import {Redirect} from 'react-router-dom';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLogged: false
        }
    }

    componentWillMount() {
        if (sessionStorage.getItem('token')) {
            console.log("TODO -- Carregamento user e outras coisas");
        }
        else {
            this.setState({isLogged: true});
        }
    }

    render() {
        if (this.state.isLogged) {
            return (<Redirect to={'/login'}/>);
        }

        return (
            <div>
                <h1>Home Page</h1>
            </div>
        );
    }
}
