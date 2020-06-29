import React, { useState, useEffect } from 'react'  
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import paginationFactory from 'react-bootstrap-table2-paginator';

const { SearchBar } = Search;

const ReactTable = props => {
    console.log("p->", props);
    const [ data, setData ] = useState(props.listData);
  
    useEffect(
      () => {
        setData(props.listData);
      },
      [ props ]
    );
    
    const customTotal = (from, to, size) => (
          <span className="react-bootstrap-table-pagination-total">
            Showing { from } to { to } of { size } Results
          </span>
    );
        
    const options = {
        paginationSize: 5,
        pageStartIndex: 1,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        hideSizePerPage: true, // Hide the sizePerPage dropdown always
        hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        disablePageTitle: true,
        sizePerPageList: [{ text: '5', value: 5 }]
    };
    
    return(
        <ToolkitProvider
            keyField='_id'
            data={ data } 
            columns={ props.columns }
            search
        >
            {
                _props => (
                    <div>
                        <SearchBar { ..._props.searchProps } />
                        <BootstrapTable
                            { ..._props.baseProps }
                            pagination={ paginationFactory(options) }
                            noDataIndication="No users"
                            defaultSorted={ props.defaultSorted }
                            headerWrapperClasses="tableHeader"
                            bodyClasses="tableBody"
                            wrapperClasses="tableContainer"
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    );
}

export default ReactTable;