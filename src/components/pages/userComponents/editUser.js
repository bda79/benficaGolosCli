import React, { useState, useEffect } from 'react';
import FontAwesome from 'react-fontawesome';

const EditUser = props => {
  const [ user, setUser ] = useState(props.currentUser);
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
    let _value = value;
    if (name === 'isAdmin') {
        _value = e.target.checked;
    }
    setUser({ ...user, [name]: _value })
  }

  const handleUpdate = () => {
    if (props.isAdmin) {
      props.updateUser(user._id, user);
    }
    else 
      props.updateUser(user);
  }

  const handleEdit = () => {
    props.setEditing(false);
  }

  const handleCancel = () => {
    props.cancelNonAdminEdit();
  }

  return (
    
      <div className="form">
          <div className="form-group" >
              <label htmlFor="name">Name</label>
              <input type="name" name="name" value={user ? user.name : ''} onChange={handleInputChange}/>
          </div>
          <div className="form-group" >
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={user ? user.email : ''} onChange={handleInputChange}/>
          </div>
          {props.isAdmin && (
            <div className="form-group-checkbox" >
                  <label className="checkbox-inline">Admin</label>
                  <label className="customCheckbox">
                      <input type="checkbox" name="isAdmin" checked={user.isAdmin} onChange={handleInputChange} />
                      <span></span>
                  </label>
              </div>
            )}
          <div className="form-group" >
              <div className="form-password" style={{position: 'relative'}}>
                  <label style={{display: 'flex'}} htmlFor="password">Password</label>
                  <input
                    type={ showPassword? "text" : "password" } 
                    name="password" 
                    value={user && user.password ? user.password : ''} 
                    onChange={handleInputChange}
                  />
                  <FontAwesome onClick={togglePassword}
                    className="password-icon"
                    name={ showPassword ? "eye" : "eye-slash" }
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
            <button onClick={handleUpdate}>Update</button>
            {props.isAdmin && (
              <button onClick={handleEdit} className="button muted-button">
                Cancel
              </button>
            )}
            {!props.isAdmin && (
              <button onClick={handleCancel} className="button muted-button">
                Cancel Edit
              </button>
            )}
          </div>
      </div>
    
  )
}

export default EditUser