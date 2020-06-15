import React from "react";
import loginImg from "../../img/slbLogo.jpg";
import { ServiceData } from '../../service/ServiceData';
import {Redirect} from 'react-router-dom';

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/);

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

export class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: null,
      email: null,
      password: null,
      isLogged: false,
      errors : {
        name: '',
        email: '',
        password: ''
      },
      submitError : ''
    }
  }

  onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let errors = { ...this.state.errors};

    switch (name) {
      case "name":
        errors.name = value.length < 3 ? "'Name' minimum 3 characters required" : "";
        break;
      case "email":
        errors.email = emailRegex.test(value) ? "" : "'Email' invalid email address";
        break;
      case "password":
        errors.password = passwordRegex.test(value) ? "" : "Password' must have 5 characters, contain 1 uppercase, 1 lowercase and 1 digit!"
        break;
      default:
        break;
    }
    
    this.setState({errors, [name]: value});
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (valid(this.state)) {
      const {name, email, password} = this.state;
      
      const userData = {
        name: name,
        email: email,
        password: password,
        isAdmin: false
      }

      const result = await ServiceData('users', 'POST', userData);
      const {data, error} = result;
      if (data) {
        sessionStorage.setItem('token', result.data);
        this.setState({isLogged: true});
      }

      if (error) {
        this.setState({submitError: error});
      }
    }
    else {
      console.log('Error submit');
      this.setState({submitError: 'Fill data!'});
    }
  }

  render() {
    const { errors, submitError } = this.state;

    if (this.state.isLogged) {
      return (<Redirect to={'/home'}/>);
    }

    if (sessionStorage.getItem('token')) {
      return (<Redirect to={'/home'}/>);
    }

    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="" />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" placeholder="name" onChange={this.onChange}/>
              {errors.name.length > 0 && (
                <span className="errorMessage">{errors.name}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" placeholder="email" onChange={this.onChange}/>
              {errors.email.length > 0 && (
                <span className="errorMessage">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" onChange={this.onChange}/>
              {errors.password.length > 0 && (
                <span className="errorMessage">{errors.password}</span>
              )}
            </div>
            {submitError && submitError.length > 0 && (<span className="errorMessage">{submitError}</span>)}
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={this.handleSubmit}>
            Register
          </button>
        </div>
      </div>
    );
  }
}