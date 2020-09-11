import React, { useState, useEffect, Fragment }  from 'react';
import AddUser from '../userComponents/addUser';
import EditUser from '../userComponents/editUser';
import UserTable from "../userComponents/userTable";
import StatusTable from "../userComponents/statusTable";
import ServiceData from "../../../service/dataUtils";
import Select from '../../custom/selectSearch';
import Storage from "../../../service/StorageData";
import './user.scss';
import _ from 'lodash';

const User = (admin) => {

	const [ error, setError ] = useState(null);
	const [ users, setUsers ] = useState([]);
	const [ status, setStatus ] = useState([]);
	const [ seasons, setSeasons ] = useState([]);
	const [ selectedSeason, setSelectedSeason ] = useState([]);
	const [ currentUser, setCurrentUser ] = useState({ _id: '', name: '', email: '', isAdmin: false, password: '' });
	const [ editing, setEditing ] = useState(false);

	useEffect(() => {
		
		const token = Storage.get('token');
		if (token) {
			loadUsers(token, admin.admin)
				.then((data) => {
					console.log(data);
					if (data) {
						if (admin.admin)
							setUsers( data.data );
						else 
						{
							const user = data.me;
							user.password = null;
							setCurrentUser( user );
							if (data.seasons) {
								const seasons = data.seasons;
								let seasonApi = seasons.map(season => {
									return {value: season._id, name: season.name}
								});
								
								const defaultValue = [{value: "0", name: '----'}];
								seasonApi = defaultValue.concat(seasonApi);
								setSeasons(seasonApi);
								setSelectedSeason("0");
						    }
							
							if (data.status) {
								let statusApi = data.status;
								statusApi.forEach((status, index) => status._id = index + 1);

								setStatus(statusApi);
							}

						}
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
	}, [admin]);


	// CRUD operations
	const _addUser = async (user) => {
		const {error, data} = await addUserInBD(user);
		if (data) {
			setUsers([ ...users, data.user ]);
			setError(null); 
		}
		if (error) {
			setError(error);
		}
	}

	const addUserInBD = async (user) => {
		const newUser = {
			name: user.name,
			email: user.email,
			password: user.password,
			isAdmin: user.isAdmin
		}

		return await saveUserBD(newUser);
	}

	const cancelNonAdminEdit = () => {
		const cUser = Storage.get("cUser");
		cUser.password = null;
		
		setCurrentUser(cUser);
	}

	const deleteUser = async (id) => {
		setEditing(false);
		
		const {error, data} = await deleteUserBD(id);
		if (data) {
			const bdUser = data;
			setUsers(users.filter(user => user._id !== bdUser._id));
			setError(null);
		}
		if (error) {
			setError(error);
		}
		
	}

	const _updateUser = async (user) => {
		if (!_.isEqual(user, currentUser)) {
			const {data, error} = await saveUser(user._id, user);
			if (data) {
				let bdUser = data;
				bdUser.password = null;
				setCurrentUser(bdUser);
				setError(null);

			}
			if (error) {
				setError(error);
			}
			
		}
		else {
			setError('Nothing change!');
		}
	}
	
	const updateUser = async (id, updatedUser) => {
		const toUpdate = users.find((user) => user._id === id);
		if (toUpdate) {
			const {data, error} = await saveUser(updatedUser._id, updatedUser);
			if (data) {
				let bdUser = data;
				bdUser.password = null;
				setEditing(false);
				setUsers(users.map(user => (user._id === bdUser._id ? bdUser : user)));
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


	const editRow = user => {
		setEditing(true);

		setCurrentUser({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, password: user.password });
	}

	const saveUser = async (id, user) => {
		let result = {};
		if (!user.password) {
			const {data, error} = await getUser(id);
			if (data) {
				user.password = data.password;
			}
			if (error) {
				result.error = error;
			}
		}

		if (result.error) return result;
		return await saveUserBD(user);
	}

	const onChangeSeason = value => {
		let id = null;
		if (value !== "0") {
			id = value;
		}
			
		setSelectedSeason(value);
		console.log("->", selectedSeason);

		loadStatus(currentUser._id, id)
			.then((data) => {
				if (data.data) {
					let statusApi = data.data;
					statusApi.forEach((status, index) => status._id = index + 1);
					
					setStatus(statusApi);
				}
			})
			.catch(err => {
				console.log("Error: ", err);
			})
	}

	return display(error, admin, editing, users, setEditing, currentUser, _updateUser, updateUser, _addUser, editRow, deleteUser, cancelNonAdminEdit, selectedSeason, seasons, onChangeSeason, status);
}

function display(error, admin, editing, users, setEditing, currentUser,_updateUser, updateUser, _addUser, editRow, deleteUser, cancelNonAdminEdit, selectedSeason, seasons, onChangeSeason, status) {
	
	if (admin.admin) {
		return (
			<div className="main">
				<div className="flex-container">
					<div className="column">
						{editing ? (
							<Fragment>
								<h2>Edit User</h2>
								<EditUser
									editing={editing}
									setEditing={setEditing}
									currentUser={currentUser}
									updateUser={updateUser}
									cancelNonAdminEdit={cancelNonAdminEdit}
									isAdmin={admin.admin}
								/>
							</Fragment>
						) : (
							<Fragment>
								<h2>Add User</h2>
								<AddUser addUser={_addUser} />
							</Fragment>
						)}
					</div>
					<div className="column">
						<h2>View users</h2>
						<UserTable users={users} editRow={editRow} deleteUser={deleteUser} />
					</div>
				</div>
				{error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
			</div>
		)
	}
	else {
		return (
			<div className="main">
				<div className="flex-container">
					<div className="column">
						<Fragment>
							<h2>Edit User</h2>
							<EditUser
								editing={editing}
								setEditing={setEditing}
								currentUser={currentUser}
								updateUser={_updateUser}
								cancelNonAdminEdit={cancelNonAdminEdit}
								isAdmin={admin.admin}
							/>
						</Fragment>
					</div>
					<div className="column">
					<h2>Payments</h2>
						<div className="seasonClass" >
							<label style={labelStyle} htmlFor="seasonId">Seasons</label>
							<div className="seasonObj" >
								<Select 
									name="seasonId" 
									options={seasons} 
									hint="select Season" 
									onChange={onChangeSeason} 
									value={selectedSeason}
								/>
							</div>
						</div>
						<StatusTable status={status} />
					</div>
				</div>
				{error && (<span style={errorStyle} className="errorMessage">{error.length > 0 ? error : ''}</span>)}
			</div>
		)
	}
}
const labelStyle = { fontWeight: "bold"}
const errorStyle = {
	textShadow: "10px 10px 10px",
    color: "red"
}

const loadUsers = async (token, admin)=> {
	const cUser = Storage.get('cUser');
	let path = `status/list/${cUser._id}`;
	
	const headers = ServiceData.headers(token);
	const options = ServiceData.options('GET', null, headers);
	
	if (admin)
		return await ServiceData.execute('users', options);
	else
		return await ServiceData.normalUserExecute('users/me', 'seasons', path, options);
}

const loadStatus = async (userID, seasonID) => {
	const token = Storage.get('token');
	const headers = ServiceData.headers(token);
	const options = ServiceData.options('GET', null, headers);
	let path = `status/list/${userID}`;
	if (seasonID) {
		path = `status/list/${seasonID}/user/${userID}`;
	}

	return await ServiceData.execute(path, options);
}

const getUser = async (id)=> {
	const token = Storage.get('token');
	const path = `users/${id}`;
	let result = {}
	
	const headers = ServiceData.headers(token);
    const options = ServiceData.options('GET', null, headers);

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
			console.log("GetUser Error: ", err);
			result.error = err.response.data;
		});

	return result;
}

const saveUserBD = async (user) => {
	let result = {};
	const token = Storage.get('token');
	let path = `users/${user._id}`;
	let method = 'PUT'
	if (!user._id) {
		path = "users";
		method = "POST";
	}
	
	const headers = ServiceData.headers(token);
	const options = ServiceData.options(method, user, headers);
	
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
			console.log("GetUser Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

const deleteUserBD = async (id) => {
	let result = {};
	const token = Storage.get('token');
	const path = `users/${id}`;

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
			console.log("GetUser Error: ", err);
			result.error = err.response.data;
		});
	
	return result;
}

export default User

