import React, { useState, useEffect} from 'react';
import Select from '../../custom/selectSearch';
import Joi from 'joi';

const AddPayment = (props) => {
    const initialState = { date: '', userId: '', amount: ''};
    const [ payment, setPayment ] = useState(initialState);
    const [ error, setError ] = useState(null);
    const [ users, setUsers] = useState([]);
    const [ selectedUser, setSelectedUser] = useState('');
     

    useEffect(
        () => {
            let usersApi = props.users.map(user => {
                return {value: user._id, name: user.name}
            });

            setUsers(usersApi);
        }, 
        [props]
    );
    
    const onChangeUser = value => {
        setSelectedUser(value);
        
        payment.userId = value;
        setPayment(payment);

    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        
		setPayment({ ...payment, [name]: value });
    }

    const paymentValidator = () => {
        const {date, userId, amount} = payment;
        if (!date) {
            return "Error: Fill Date!"
        }
        if (!userId) {
            return "Error: Select User!"
        }
        if (!amount) {
            return "Error: Add amount!"
        }

        return null;
    }

    const submitPayment = () => {
        let errorMsg = paymentValidator();
        if (errorMsg) {
            setError(errorMsg);
        }
        else {
            const { error } = validatePayment(payment);
            if (error) {
                setError(error.details[0].message);
            }
            else {
                props.addPayment(payment);
                setPayment(initialState);
                setError(null);
                setSelectedUser('');
            }
        }
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
                    hint="select user" 
                    onChange={onChangeUser} 
                    value={selectedUser}
                />
            </div>
            <div className="form-group" >
                <label htmlFor="amount">Amount</label>
                <input type="number" name="amount" value={payment ? payment.amount : ''} onChange={handleInputChange}/>
            </div>
            <div className="button-joiner">
                <button onClick={submitPayment} >Add</button>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
	)
}

const errorStyle = {
    paddingTop: "15px",
	textShadow: "10px 10px 10px",
    color: "red"
}

function validatePayment(amount) {

    const schema = {
        date: Joi.date().required(),
        userId: Joi.string().min(24).required(),
        amount: Joi.number().min(0).required()
    };

    return Joi.validate(amount, schema);
}

export default AddPayment;