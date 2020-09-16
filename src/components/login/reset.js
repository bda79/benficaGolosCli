import React from 'react';
import loginImg from '../../img/slbLogo.jpg'
import './Login.scss';
import './style.scss';
import ServiceData from "../../service/dataUtils";
import Storage from '../../service/StorageData';
import { Redirect } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
const jwt = require('jsonwebtoken');

const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/);
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
const inputStyle = {
  marginTop: '10px',
  marginBottom: '15px'
};

const groupStyle = {
  marginTop: '1em'
};

const valid = ({errors, ...rest}) => {
  let valid = true;

  // validate form errors being empty
  Object.values(errors).forEach(val => {
    val.length > 0 && (valid = false);
  });
  
  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
}

export class Reset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      isLogged: false,
      redirect: false,
      showPassword: false,
      errors : {
        email: '',
        password: ''
      },
      error: null,
      token: props.match.params.token
    }
  }

  componentDidMount() {
    const token = this.state.token;
    const decoded = jwt.verify(token, 'pizziUmaMerda');
    const endDate = moment(decoded.exp);
    const now = moment(new Date());
    const diff = endDate.diff(now);
    const diffDuration = moment.duration(diff)
    console.log("Diff", diffDuration.minutes());
    if (diffDuration.minutes() > 0) {
      this.setState({email: decoded.email});
    }
    else {
      this.setState({redirect: true});
    }
   
  }

  onChange = (e) => {
    e.preventDefault();
    let errors = { ...this.state.errors};
    const { name, value } = e.target;
    if (name === 'password') {
      errors.password = passwordRegex.test(value) ? "" : "Password' must have 5 characters, contain 1 uppercase, 1 lowercase and 1 digit!";
    }
    if (name === 'email') {
      errors.email = emailRegex.test(value) ? "" : "'Email' invalid email address";
    }

    this.setState({errors, error: '', [name]: value});
  }

  togglePassword = () => {
    const showPassword = this.state.showPassword;
    this.setState({showPassword: !showPassword})
  }

  loadData = async (userData) => {
    const headers = ServiceData.headers();
    const options = ServiceData.options('POST', userData, headers);

    return await ServiceData.execute('forgot/reset', options);
  }

  reset = (e) => {
    e.preventDefault();
    if (valid(this.state)) {
      const {email, password} = this.state;
      const userData = { email: email, password: password};
      this.loadData(userData)
      .then((data) => {
          if (data.data) {
            Storage.add('token', data.data);
            this.setState({isLogged: true});
          }
          if (data.error) {
            this.setState({error: data.error});
          }
      }).catch(err => {
          console.log("Err", err);
          this.setState({error: err});
      })

    } else {
      console.log("Error email and password required!");
      this.setState({error: 'Error email and password required!'});
    }

  }

  render() {
    const {email, showPassword, errors, error, redirect, isLogged} = this.state;
    const iconName = showPassword ? "eye" : "eye-slash";
    if (isLogged)
      return (<Redirect to={'/home'}/>);
    
    if (redirect)
      return (<Redirect to={'/forgot'}/>);

    return (
      <div className="Login">
        <div className="login">
         <div className="login_container">
            <div className="base-container">
              <div className="header">Reset</div>
              <div className="content">
                <div className="image">
                  <img src={loginImg} alt="" />
                </div>
                <div className="form">
                  <div className="form-group" style={groupStyle}>
                    <label htmlFor="email">Email</label>
                    <input style={inputStyle} type="email" name="email" value={email ? email : ''} onChange={this.onChange}/>
                    <span className="errorMessage">{errors.email.length > 0 ? errors.email : ''}</span>
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
                        autoComplete="on"
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
                    <span className="errorMessage">{errors.password.length > 0 ? errors.password : ''}</span>
                  </div>
                  {error && error.length > 0 && (<span className="errorMessage">{error}</span>)}
                </div>
              </div>
              <div className="footer">
                <button type="button" className="btn" onClick={this.reset}>
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
