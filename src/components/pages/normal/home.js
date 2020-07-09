import React from "react";
import { Redirect } from 'react-router-dom';
import ServiceData from "../../../service/dataUtils";
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
        const headers = ServiceData.headers(token);
        const options = ServiceData.options('GET', null, headers);

        return await ServiceData.execute('users/me', options);
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