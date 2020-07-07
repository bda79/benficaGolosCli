import React from 'react';
import ReactTable from '../../custom/bootstraptab';
import {ImageUtils} from '../../../service/utils';

const TeamTable = props => {
    console.log("Table-p->", props);
    const editRow = (user) => {
        props.editRow(user);
    }

    const deleteRow = (id) => {
        props.deleteTeam(id);
    }

    const columns = [
        { dataField: '_id', text: 'ID', hidden: true }, 
        { dataField: 'name', text: 'Name', sort: true, headerAlign: 'center' }, 
        { dataField: 'sigla', text: 'Sigla', sort: true, headerAlign: 'center' }, 
        { dataField: 'logo', text: 'Logo', headerAlign: 'center',
          formatter: (cell, row) => {
            return (
            <div className="logo">
                {row.logo && ( <img src={ImageUtils.getImage(row.logo)} alt=""/> )}
            </div>)
          } 
        }, 
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

    return(<ReactTable listData={props.teams} columns={columns} defaultSorted={defaultSorted} />);
}

export default TeamTable;