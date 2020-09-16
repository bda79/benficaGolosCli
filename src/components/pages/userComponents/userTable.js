import React from 'react';
import ReactTable from '../../custom/bootstraptab';

const UserTable = props => {

    const editRow = (user) => {
        props.editRow(user);
    }

    const deleteRow = (id) => {
        props.deleteUser(id);
    }

    const columns = [
        { dataField: '_id', text: 'ID', hidden: true }, 
        { dataField: 'name', text: 'Name', sort: true, headerAlign: 'center' }, 
        { dataField: 'email', text: 'Email', sort: true, headerAlign: 'center' }, 
        { dataField: 'password', text: 'Password', hidden: true }, 
        { dataField: 'actions', text: 'Actions', isDummyField: true,
          formatter: (cell, row ) => {
              return ( 
                  <div className="button-joiner">
                      <button
                          onClick={() => {
                              editRow(row);
                          }}
                          className="button"
                      >
                          Edit
                      </button>
                      <button
                          onClick={() => {
                              deleteRow(row._id);
                          }}
                          className="button muted-button"
                      >
                          Delete
                      </button>
                  </div>
              );
          },
          headerAlign: 'center'}
    ];
      
    const defaultSorted = [{dataField: 'name', order: 'asc' }];

    return(<ReactTable listData={props.users} columns={columns} defaultSorted={defaultSorted} searchID={'user'} />);
}

export default UserTable;