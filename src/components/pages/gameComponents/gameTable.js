import React from 'react';
import ReactTable from '../../custom/bootstraptab';
import {ImageUtils} from '../../../service/utils';
import moment from 'moment';

const GameTable = (props) => {
    const editRow = (game) => {
        props.editRow(game);
    }

    const deleteRow = (id) => {
        props.deleteGame(id);
    }

    const columns = [
        { dataField: '_id', text: 'ID', hidden: true }, 
        { dataField: 'name', text: 'Name', sort: true, headerAlign: 'center' },
        { dataField: 'date', text: 'Date', sort: true, headerAlign: 'center', 
          formatter: (cell, row) => {
            return (
                <div style={{textAlign:"center"}}className="date-center">
                    {`${moment(row.date).format("DD-MM-YYYY")? moment(row.date).format("DD-MM-YYYY"):moment(row.date).format("DD-MM-YYYY") }`}
                </div>
            );
          }
        },
        { dataField: 'championship._id', text: 'CH_ID', hidden: true},
        { dataField: 'championship.name', text: 'Championship', sort: true, headerAlign: 'center'},
        { dataField: 'homeTeam._id', text: 'HOME_ID', hidden: true},
        { dataField: 'homeTeam.logo', text: 'Home', headerAlign: 'center',
          formatter: (cell, row) => {
            return (
            <div className="logo">
                {row.homeTeam.logo && ( <img src={ImageUtils.getImage(row.homeTeam.logo)} alt=""/> )}
            </div>)
          } 
        },
        { dataField: 'awayTeam._id', text: 'AWAY_ID', hidden: true},
        { dataField: 'awayTeam.logo', text: 'Away', headerAlign: 'center',
          formatter: (cell, row) => {
            return (
            <div className="logo">
                {row.awayTeam.logo && ( <img src={ImageUtils.getImage(row.awayTeam.logo)} alt=""/> )}
            </div>)
          } 
        }, 
        { dataField: 'score', text: 'Score', isDummyField: true,
          formatter: (cell, row) => {
              return (<div style={{textAlign:"center"}} className="score-board">
                        <div style={{display:"inline-block", padding: "2px"}} className="team">
                            <div className="score-box">
                                {row.homeGoals}
                            </div>
                        </div>
                        <div style={{display:"inline-block", padding: "2px"}} className="separator">-</div>
                        <div style={{display:"inline-block", padding: "2px"}} className="team">
                            <div className="score-box">
                                {row.awayGoals}
                            </div>
                        </div>
                    </div>
            )}
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

    return(<ReactTable listData={props.games} columns={columns} defaultSorted={defaultSorted} maxRows={4} searchID={'game'}/>);
}

export default GameTable;