import React, { useState } from 'react';
import FontAwesome from 'react-fontawesome';

const AddUser = props => {
	const initialState = { id: null, name: '', email: '', password: '' };
    const [ user, setUser ] = useState(initialState);
    const [ showPassword, setShowPassword ] = useState(false);

	const handleInputChange = event => {
		const { name, value } = event.target

		setUser({ ...user, [name]: value })
    }
    
    const togglePassword = e => {
        setShowPassword(!showPassword);
    }

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				if (!user.name || !user.email) return

				props.addUser(user)
				setUser(initialState)
			}}
		>
            <div className="form">
                <div className="form-group" >
                    <label htmlFor="name">Name</label>
                    <input type="name" name="name" value={user.name} onChange={handleInputChange}/>
                </div>
                <div className="form-group" >
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={user.email} onChange={handleInputChange}/>
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
            </div>
		</form>
	)
}

export default AddUser