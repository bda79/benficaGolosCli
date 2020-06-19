import React, { useState, useEffect } from 'react';
import FontAwesome from 'react-fontawesome';

const EditUser = props => {
  const [ user, setUser ] = useState(props.currentUser);
  const [ password, setPassword ] = useState(props.currentUser.password);
  const [ showPassword, setShowPassword ] = useState(false);

  useEffect(
    () => {
      setUser(props.currentUser);
    },
    [ props ]
  );
  
  const togglePassword = e => {
    setShowPassword(!showPassword);
  }

  const handleInputChange = e => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value })
  }

  const handlePasswordChange = e => {
    const { value } = e.target;
    if (user.password !== password) {
      setPassword(value);
    }
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()

        props.updateUser(user.id, user)
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
                    placeholder="password" 
                    onChange={handlePasswordChange}
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
            <button>Update user</button>
            <button onClick={() => props.setEditing(false)} className="button muted-button">
                Cancel
            </button>
        </div>
    </form>
  )
}

export default EditUser