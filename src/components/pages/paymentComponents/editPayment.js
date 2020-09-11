import React, { useState, useEffect } from 'react';
import Select from '../../custom/selectSearch';

const EditPayment = (props) => {
    const [ payment, setPayment ] = useState(props.currentPayment);
    const [ users, setUsers] = useState([]);
    const [ selectedUser, setSelectedUser] = useState(props.currentPayment.userId);
    const [ error, setError ] = useState(null);

    useEffect(
        () => {
            setPayment(props.currentPayment);
            let usersApi = props.users.map(user => {
                return {value: user._id, name: user.name}
            });

            setUsers(usersApi);
            setSelectedUser(props.currentPayment.userId);
        }, 
        [props]
    );

    const handleEdit = () => {
        props.setEditing(false);
    }

    const handleInputChange = e => {
        const {name, value } = e.target;

        setPayment({ ...payment, [name]: value });
    }

    const onChangeUser = value => {
        setSelectedUser(value);
        
        payment.userId = value;
        setPayment(payment);

    }

    const handleUpdate = () => {
        setError(null);
        props.updatePayment(payment._id, payment);
    }

    return (
        <div className="form">
            <div className="form-group" >
                <label htmlFor="date">Date</label>
                <input type="date" name="date" value={payment ? payment.date : ''} onChange={handleInputChange}/>
            </div>
            <div className="form-group" >
                <label htmlFor="userId">User</label>
                <Select 
                    name="userId" 
                    options={users} 
                    hint="select User" 
                    onChange={onChangeUser} 
                    value={selectedUser}
                />
            </div>
            <div className="form-group" >
                <label htmlFor="amount">Amount</label>
                <input type="number" name="amount" value={payment ? payment.amount : ''} onChange={handleInputChange}/>
            </div>
            <div className="button-joiner">
                <button onClick={handleUpdate} >Update</button>
                <button onClick={handleEdit} className="button muted-button">Cancel</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
    );
}

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

export default EditPayment;