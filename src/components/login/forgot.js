import React from 'react';
import loginImg from '../../img/slbLogo.jpg'
import './Login.scss';
import './style.scss';
import { NavLink } from 'react-router-dom';
import { ServiceData } from '../../service/ServiceData';
import { Redirect } from 'react-router-dom';

const inputStyle = {
  marginTop: '15px',
  marginBottom: '20px'
};

const groupStyle = {
  marginTop: '2em'
};

const navStyle = {
  marginTop: '15px'
};


export class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      redirect: false,
      toLogin: false,
      error: null,
      success: null
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  loadData = async (userData) => {
    return await ServiceData('forgot/get', 'PUT', userData);
  }

  toLogin = (e) => {
    this.setState({redirect: !this.state.redirect});
  }

  sendEmail = () => {
    const {email} = this.state;
    if ( email) {
      const userData = { email: email};
      this.loadData(userData)
      .then((data) => {
          if (data.data) {
            this.setState({success: data.data, toLogin: true});
          }
          if (data.error) {
            this.setState({error: data.error});
          }
      }).catch(err => {
          console.log("Err", err);
          this.setState({error: err});
      })
    }
    else {
      console.log("Error email required!");
      this.setState({error: 'Error email required!'});
    }

  }

  render() {
    const {error, success, redirect, toLogin} = this.state;
    if (redirect)
      return (<Redirect to={'/login'}/>);

    return (
      <div className="Login">
        <div className="login">
         <div className="login_container">
            <div className="base-container" ref={this.props.containerRef}>
              <div className="header">Forgot</div>
              <div className="content">
                <div className="image">
                  <img src={loginImg} alt="" />
                </div>
                <div className="form">
                  <div className="form-group" style={groupStyle}>
                    <label htmlFor="email">Email</label>
                    <input style={inputStyle} type="email" name="email" placeholder="email" onChange={this.onChange}/>
                  </div>
                  {error && error.length > 0 && (<span className="errorMessage">{error}</span>)}
                  {success && success.length > 0 && (<span className="successMessage">{success}</span>)}
                </div>
                <NavLink style={navStyle} to='/login'>to Login</NavLink>
                {toLogin && (
                  <button type="button" className="btn" style={groupStyle} onClick={this.toLogin}>
                    Go to Login
                  </button>
                )}
                {!toLogin && (
                  <button type="button" className="btn" style={groupStyle} onClick={this.sendEmail}>
                    Send
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
