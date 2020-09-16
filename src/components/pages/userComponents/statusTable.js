import React from 'react';
import ReactTable from '../../custom/bootstraptab';
import moment from 'moment';

const StatusTable = props => {

    const columns = [
        { dataField: '_id', text: 'ID', hidden: true }, 
        { dataField: 'date', text: 'Date', sort: true, headerAlign: 'center', 
          formatter: (cell, row) => {
            return (
                <div style={{textAlign:"center"}}className="date-center">
                    {`${moment(row.date).format("DD-MM-YYYY")? moment(row.date).format("DD-MM-YYYY"):moment(row.date).format("DD-MM-YYYY") }`}
                </div>
            );
          }
        },
        { dataField: 'total', text: 'Amount', sort: true, headerAlign: 'center',
            formatter: (cell, row) => {
            return (
            <div style={{textAlign:"center"}}>
                <div style={{display:"inline-block", padding: "2px"}}>
                <div className="score-box">
                        {row.total}
                    </div>
                </div>
            </div>)
        } 
      } 
         
    ];
      
    const defaultSorted = [{dataField: 'date', order: 'asc' }];

    return(<ReactTable listData={props.status} columns={columns} defaultSorted={defaultSorted} maxRows={5} searchID={'status'}/>);
}

export default StatusTable;