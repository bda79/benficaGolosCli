import React from 'react';
import ReactTable from '../../custom/bootstraptab';
import moment from 'moment';

const PaymentTable = (props) => {
    const editRow = (payment) => {
        props.editRow(payment);
    }

    const deleteRow = (id) => {
        props.deletePayment(id);
    }

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
        { dataField: 'user._id', text: 'USER_ID', hidden: true},
        { dataField: 'user.name', text: 'Name', sort: true, headerAlign: 'center'},
        { dataField: 'amount', text: 'Amount', headerAlign: 'center',
          formatter: (cell, row) => {
            return (
            <div style={{textAlign:"center"}}>
                <div style={{display:"inline-block", padding: "2px"}}>
                <div className="score-box">
                        {row.amount}
                    </div>
                </div>
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

    return(<ReactTable listData={props.payments} columns={columns} defaultSorted={defaultSorted} maxRows={5} />);
}

export default PaymentTable;