import React, { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import Joi from 'joi';

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

const AddUser = props => {
	const initialState = { _id: null, name: '', email: '', isAdmin: false, password: '' };
    const [ user, setUser ] = useState(initialState);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ error, setError ] = useState(null);

	const handleInputChange = event => {
        const { name, value } = event.target;
        let _value = value;
        if (name === 'isAdmin') {
            _value = event.target.checked;
        }
        
		setUser({ ...user, [name]: _value })
    }
    
    const togglePassword = e => {
        setShowPassword(!showPassword);
    }

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				if (!user.name || !user.email) {
                    setError("Error: Fill Name and Email.");
                } 
                else {
                    const { error } = validateUser(user);
                    if (error) {
                        setError(error.details[0].message);
                    }
                    else {
                        props.addUser(user)
                        setUser(initialState)
                    }
                }
			}}
		>
            <div className="form">
                <div className="form-group" >
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" value={user.name} onChange={handleInputChange}/>
                </div>
                <div className="form-group" >
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={user.email} onChange={handleInputChange}/>
                </div>
                <div className="form-group-checkbox" >
                    <label className="checkbox-inline">Admin</label>
                    <label className="customCheckbox">
                        <input type="checkbox" name="isAdmin" value={user.isAdmin} onChange={handleInputChange}/>
                        <span></span>
                    </label>
                </div>
                <div className="form-group" >
                    <div className="form-password" style={{position: 'relative'}}>
                        <label style={{display: 'flex'}} htmlFor="password">Password</label>
                        <input
                            type={ showPassword? "text" : "password" } 
                            name="password" 
                            value={user.password} 
                            onChange={handleInputChange}
                        />
                        <FontAwesome onClick={togglePassword}
                            className="password-icon"
                            name={ showPassword ? "eye-slash" : "eye" }
                            style={{ 
                                position: 'absolute',
                                right: '20px',
                                bottom: '13px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
                <div className="button-joiner">
                    <button>Add</button>
                </div>
                {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
            </div>
		</form>
	)
}

function validateUser(user) {
    const schema = {
        _id: Joi.string().allow(null).allow(''),
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string()
            .min(5)
            .required()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/)
            .error(() => {
                return {
                  message: "'Password' must have 5 characters, contain 1 uppercase, 1 lowercase and 1 digit!",
                };
              }),
        isAdmin: Joi.boolean()
    };
    
    return Joi.validate(user, schema);
}

export default AddUser