import React from 'react';
import ReactTable from '../../custom/bootstraptab';
import moment from 'moment';

const SeasonTable = (props) => {

    const editRow = (season) => {
        props.editRow(season);
    }

    const deleteRow = (id) => {
        props.deleteSeason(id);
    }

    const columns = [
        { dataField: '_id', text: 'ID', hidden: true }, 
        { dataField: 'name', text: 'Name', sort: true, headerAlign: 'center' },
        { dataField: 'begin', text: 'Begin Date', sort: true, headerAlign: 'center', 
          formatter: (cell, row) => {
            return (
                <div style={{textAlign:"center"}}className="date-center">
                    {`${moment(row.begin).format("DD-MM-YYYY")? moment(row.begin).format("DD-MM-YYYY"):moment(row.begin).format("DD-MM-YYYY") }`}
                </div>
            );
          }
        },
        { dataField: 'end', text: 'End Date', sort: true, headerAlign: 'center', 
          formatter: (cell, row) => {
            return (
                <div style={{textAlign:"center"}}className="date-center">
                    {`${moment(row.end).format("DD-MM-YYYY")? moment(row.end).format("DD-MM-YYYY"):moment(row.end).format("DD-MM-YYYY") }`}
                </div>
            );
          }
        },
        { dataField: 'goals', text: 'Goals', sort: true, headerAlign: 'center', 
            formatter: (cell, row) => {
                return (<div style={{textAlign:"center"}} className="score-board">
                        <div style={{display:"inline-block", padding: "2px"}} className="team">
                            <div className="score-box">
                                {row.goals}
                            </div>
                        </div>
                    </div>
            )}
        },
        { dataField: 'games', text: 'Games', isDummyField: true,
          formatter: (cell, row ) => {
              return (<div style={{textAlign:"center"}} className="score-board">
                {row.games.length}
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

    return(<ReactTable listData={props.seasons} columns={columns} defaultSorted={defaultSorted} maxRows={4} />);
}

const defaultSorted = [{dataField: 'name', order: 'asc' }];



export default SeasonTable;