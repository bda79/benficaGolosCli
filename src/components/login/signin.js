import React from 'react';
import loginImg from '../../img/slbLogo.jpg';
import axios from 'axios';
import {Redirect} from 'react-router-dom';


export class Signin extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLogged: false
    }
  }

  login = async () => {
   const userData = {
     email: this.state.email,
     password: this.state.password
   };

   if (userData.email && userData.password) {
      try {
        await axios('http://localhost:5000/api/auth', {
          method: 'POST',
          data: userData,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          }
        }).then(response => { 
          if (response.data) {
            sessionStorage.setItem('token', response.data);
            this.setState({isLogged: true});
          } 
          else {
            console.log("Email or password invalid!");
          }
        })
      } catch (error) {
        console.log("Email or password invalid!");
      }
      
   }
   else
      console.log("Error email and password required!");
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
    console.log(this.state);
  }

  render() {
    if (this.state.isLogged) {
      return (<Redirect to={'/home'}/>);
    }

    if (sessionStorage.getItem('token')) {
      return (<Redirect to={'/home'}/>);
    }

    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="" />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" placeholder="email" onChange={this.onChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" onChange={this.onChange}/>
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={this.login}>
            Login
          </button>
        </div>
      </div>
    );
  }
}