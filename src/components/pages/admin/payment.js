import React, { useState, useEffect, Fragment } from "react";
import AddPayment from "../paymentComponents/addPayment";
import EditPayment from "../paymentComponents/editPayment";
import PaymentTable from "../paymentComponents/paymentTable";
import ServiceData from "../../../service/dataUtils";
import Storage from "../../../service/StorageData";
import moment from 'moment';

const Payment = () => {
    
    const [ error, setError ] = useState(null);
	const [ payments, setPayments ] = useState([]);
	const [ users, setUsers ] = useState([]);
    const [ currentPayment, setCurrentPayment ] = useState({ _id: '', date: '', amount: '', userID: '' });
	const [ editing, setEditing ] = useState(false);

    useEffect(() => {
        const token = Storage.get('token');
        if (token) {
            loadData(token)
            .then((data) => {
				
                if (data.payments) {
                    setPayments(data.payments);
                    setError(null);
				}
				if (data.users) {
					setUsers(data.users);
					setError(null);
				}
                if (data.error) {
                    setError( data.error );
                }
            })
            .catch(err => {
                console.log("Error: ", err);
            })
        }

    }, [currentPayment]);

    //Crud operations
    const _addPayment = async (payment) => {
		
		const {error, data} = await addPaymentInBD(payment);
		if (data) {
			setPayments(data);
            setError(null);
            setEditing(false);
		}
		if (error) {
			setError(error);
		}
    }

    const addPaymentInBD = async (payment) => {
		return await savePaymentBD(payment);
	}

    const deletePayment = async (id) => {
		setEditing(false);
		
		const {error, data} = await deletePaymentBD(id);
		if (data) {
            const bdPayment = data;
			setPayments(payments.filter(payment => payment._id !== bdPayment._id));
			setError(null);
		}
		if (error) {
			setError(error);
		}
		
    }
    
    const updatePayment = async (id, payment) => {
		const toUpdate = payments.find((payment) => payment._id === id);
		if (toUpdate) {
			const {data, error} = await savePaymentBD(payment);
			if (data) {
				let bdPayment = data;
				setEditing(false);
				setPayments(payments.map(payment => (payment._id === bdPayment._id ? bdPayment : payment)));
				setError(null);
			}
			if (error) {
				console.log(error);
				setError(error);
			}
		} 
		else {
			setError('Nothing change!');
		}
    }
    
    const editRow = payment => {
		setEditing(true);
		const {user} = payment;
		setCurrentPayment({ 
			_id: payment._id, 
			date: moment(payment.date).format("yyyy-MM-DD"), 
            amount: payment.amount,
			userId: user._id
		});
    }

    return display(error, editing, payments, users, setEditing, currentPayment, updatePayment, _addPayment, editRow, deletePayment);
}

function display(error, editing, payments, users, setEditing, currentPayment, updatePayment, _addPayment, editRow, deletePayment) {
    return (
        <div className="main">
            <div className="flex-container">
                <div className="column-game">
                    {editing ? (
                        <Fragment>
                            <h2>Edit Payment</h2>
                            <EditPayment
                                editing={editing}
                                setEditing={setEditing}
                                currentPayment={currentPayment}
                                updatePayment={updatePayment}
								users={users}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h2>Add Payment</h2>
                            <AddPayment addPayment={_addPayment} users={users} />
                        </Fragment>
                    )}
                </div>
                <div className="column-game-table">
                    <h2>View Payments</h2>
                    <PaymentTable payments={payments} editRow={editRow} deletePayment={deletePayment} />
                </div>
            </div>
            {error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
        </div>
    )
}

const errorStyle = {
	textShadow: "10px 10px 10px",
    color: "red"
}

const loadData = async (token) => {
	const headers = ServiceData.headers(token);
	const options = ServiceData.options('GET', null, headers);
	return await ServiceData.paymentExecute('payments', 'users', options);
}

const savePaymentBD = async (payment) => {
	let result = {};
	const token = Storage.get('token');
	let path = `payments/${payment._id}`;
	let method = 'PUT'
	if (!payment._id) {
		path = "payments";
		method = "POST";
	}
	
	const headers = ServiceData.headers(token);
	const options = ServiceData.options(method, payment, headers);
	
	await ServiceData.execute(path, options)
		.then((data) => {
			if (data.data) {
				result.data = data.data;
			}
			if (data.error) {
				result.error = data.error;
			}
			
		})
		.catch(err => {
			console.log("Put/Post Payment Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

const deletePaymentBD = async (id) => {
	let result = {};
	const token = Storage.get('token');
	const path = `payments/${id}`;

	const headers = ServiceData.headers(token);
	const options = ServiceData.options('DELETE', null, headers);

	await ServiceData.execute(path, options)
		.then((data) => {
			if (data.data) {
				result.data = data.data;
			}
			if (data.error) {
				result.error = data.error;
			}
		})
		.catch(err => {
			console.log("Delete Payment Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

export default Payment;