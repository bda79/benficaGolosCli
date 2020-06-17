import React from "react";
import {Redirect} from 'react-router-dom';
import { ServiceData } from "../../../service/ServiceData";
import Storage from "../../../service/StorageData";

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLogged: false,
          loading: 'initial',
          user: ''
        }
    }

    loadData = async (token) => {
        return await ServiceData('users/me', 'GET', null, token);
    }

    componentDidMount() {
        this.setState({ loading: 'true' });
        const token = Storage.get('token');
        if (token) {
            this.loadData(token)
            .then((data) => {
                
                if (data.data) {
                    const user = data.data;
                    
                    this.setState({
                        user: user,
                        loading: 'false'
                    });
                    Storage.add('cUser', user);
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
            this.setState({isLogged: true});
        }
    }


    render() {
        const {user, isLogged, loading} = this.state;
        if (user) {
            this.props.onChange(user.name);
        }
        
        if (isLogged) {
            return (<Redirect to={'/login'}/>);
        }

        if (loading === 'initial') {
            return <h2>Intializing...</h2>;
          }
          
        if (loading === 'true') {
        return <h2>Loading...</h2>;
        }
          
          return (
            <div>
              <p>Home Page</p>
              <p>{user.name}</p>
             </div>
          );
    }
}
