import React from 'react';

const UserTable = props => (
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {props.users.length > 0 ? (
            props.users.map(user => (
            <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                <div className="button-joiner">
                <button
                    onClick={() => {
                    props.editRow(user)
                    }}
                    className="button"
                >
                    Edit
                </button>
                <button
                    onClick={() => props.deleteUser(user.id)}
                    className="button muted-button"
                >
                    Delete
                </button>
                </div>
                </td>
            </tr>
            ))
        ) : (
            <tr>
            <td colSpan={3}>No users</td>
            </tr>
        )}
        </tbody>
    </table>
)

export default UserTable;