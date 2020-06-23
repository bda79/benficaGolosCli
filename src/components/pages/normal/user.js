import React, { useState, useEffect, Fragment }  from 'react';
import AddUser from '../../userComponents/addUser';
import EditUser from '../../userComponents/editUser';
import UserTable from '../../userComponents/userTable';
import { ServiceData } from "../../../service/ServiceData";
import Storage from "../../../service/StorageData";
import './user.scss';

const User = (admin) => {
	// falta guardar quando se faz add e edit, na BD
	// falta quando nao e admin
	// falta  campo para mostar erros

	const [ error, setError ] = useState(null);
	const [ users, setUsers ] = useState([]);
	const [ currentUser, setCurrentUser ] = useState({ id: null, name: null, email: null, password: null });
	const [ editing, setEditing ] = useState(false);

	useEffect(() => {
		
		const token = Storage.get('token');
		if (token) {
			
			loadUsers(token, admin)
				.then((data) => {
					console.log(data);

					if (data.data) {
						if (admin)
							setUsers( data.data );
						else
						setCurrentUser( data.data );
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
	const _addUser = user => {
		user.id = users.length + 1;
		setUsers([ ...users, user ]);
	}

	const deleteUser = id => {
		setEditing(false);

		setUsers(users.filter(user => user.id !== id));
	}

	const updateUser = (id, updatedUser) => {
		setEditing(false);

		setUsers(users.map(user => (user.id === id ? updatedUser : user)));
	}

	const editRow = user => {
		setEditing(true);

		setCurrentUser({ id: user.id, name: user.name, email: user.email, password: user.password });
	}

	return (
		<div className="container">
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
		</div>
	)
}

const loadUsers = async (token, admin)=> {
	if (admin)
		return await ServiceData('users', 'GET', null, token);
	else
		return await ServiceData('users/me', 'GET', null, token);
}

export default User

