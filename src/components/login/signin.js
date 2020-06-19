import React from 'react';
import loginImg from '../../img/slbLogo.jpg';
import { ServiceData } from '../../service/ServiceData';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

const inputStyle = {
  marginTop: '10px',
  marginBottom: '15px'
};

const groupStyle = {
  marginTop: '1em'
};

export class Signin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      showPassword: false,
      isLogged: false,
      error : null
    }
  }

  togglePassword = () => {
    const showPassword = this.state.showPassword;
    this.setState({showPassword: !showPassword})
  }

  login = async () => {
    const {email, password} = this.state;
    const userData = {
      email: email,
      password: password
    };

    if (email && password) {
      const result = await ServiceData('auth', 'POST', userData);
      const {data, error} = result;
      if (data) {
        sessionStorage.setItem('token', result.data);
        this.setState({isLogged: true});
      }

      if (error) {
        this.setState({error: error});
      }
    }
    else {
      console.log("Error email and password required!");
      this.setState({error: 'Error email and password required!'});
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    const {error, isLogged, showPassword} = this.state;
    const iconName = showPassword ? "eye-slash" : "eye";

    if (isLogged) {
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
            <div className="form-group" style={groupStyle}>
              <label htmlFor="email">Email</label>
              <input 
                style={inputStyle} 
                type="email" 
                name="email" 
                placeholder="email" 
                onChange={this.onChange}
              />
            </div>
            <div className="form-group" style={groupStyle}>
              <div className="form-password" style={{position: 'relative'}}>
                <label style={{display: 'flex'}} htmlFor="password">Password</label>
                <input 
                  style={inputStyle} 
                  type={ showPassword? "text" : "password" } 
                  name="password" 
                  placeholder="password" 
                  onChange={this.onChange}
                />
                <FontAwesome onClick={this.togglePassword}
                  className="password-icon"
                  name={ iconName }
                  style={{ 
                    position: 'absolute',
                    right: '20px',
                    bottom: '23px',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
            {error && error.length > 0 && (<span className="errorMessage">{error}</span>)}
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