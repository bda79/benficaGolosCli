import React, { useState, Fragment }  from 'react';
import AddUser from '../../userComponents/addUser';
import EditUser from '../../userComponents/editUser';
import UserTable from '../../userComponents/userTable';
import './user.scss';

const User = () => {
    // Data
	const usersData = [
		{ id: 1, name: 'Tania', email: 'fff@hotmail.com', password: '1234' },
		{ id: 2, name: 'Craig', email: 'sss@hotmail.com', password: '4321' },
		{ id: 3, name: 'Ben', email: 'bbb@hotmail.com', password: '1111' },
	]

	const initialFormState = { id: null, name: '', email: '', password: '' }

	// Setting state
	const [ users, setUsers ] = useState(usersData);
	const [ currentUser, setCurrentUser ] = useState(initialFormState);
	const [ editing, setEditing ] = useState(false);

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

export default User

