import React from "react";
import { Redirect } from 'react-router-dom';
import { ServiceData } from "../../../service/ServiceData";
import Storage from "../../../service/StorageData";

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLogged: true,
          user: ''
        }
    }

    loadData = async (token) => {
        return await ServiceData('users/me', 'GET', null, token);
    }

    componentDidMount() {
        const token = Storage.get('token');
        if (token) {
            this.loadData(token)
            .then((data) => {
                
                if (data.data) {
                    const user = data.data;
                    
                    this.setState({
                        user: user
                    });
                    Storage.add('cUser', user);
                    this.props.onChange(user);
                }
                if (data.error) {
                    console.log("Error: ", data.error);
                }
                
            })
            .catch(err => {
                console.log("Err", err);
            })

        }
        else {
            this.setState({isLogged: false});
        }
    }

    render() {
        console.log("Home render");
        const {user, isLogged} = this.state;
        
        if (!isLogged) {
            return (<Redirect to={'/login'}/>);
        }
          
          return (
            <div>
              <p>Home Page</p>
              <p>{user.name}</p>
            </div>
          );
    }
}