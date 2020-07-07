import React from 'react';
import ReactTable from '../../custom/bootstraptab';

const ChampionshipTable = (props) => {
    const editRow = (championship) => {
        props.editRow(championship);
    }

    const deleteRow = (id) => {
        props.deleteTeam(id);
    }

    const columns = [
        { dataField: '_id', text: 'ID', hidden: true }, 
        { dataField: 'name', text: 'Name', sort: true, headerAlign: 'center' }, 
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

    return(<ReactTable listData={props.championships} columns={columns} defaultSorted={defaultSorted} />);
}

export default ChampionshipTable;