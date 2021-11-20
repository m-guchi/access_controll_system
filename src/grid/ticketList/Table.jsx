import React from 'react'
import { DataGrid, GridToolbar, GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';


function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}

const columns = [
    {field: "time", headerName: "受付(更新)時間", "width": 200, type: 'dateTime',},
    {field: "id", headerName: "チケットID", "width": 220},
    {field: "user_id", headerName: "ユーザーID", "width": 220, editable: true},
]

export default function LogTicketTable (props) {

    const row = (!props.logData) ? [] : props.logData.map(val => {
        val["id"] = val["ticket_id"];
        return val;
    })

    const handleEditCell = (e) => {
        const ticketId = e.id;
        const userId = e.value;
        props.handlePutTicket(ticketId, userId);
    }

    return(
        <div style={{ height: '85vh'}}>
            <DataGrid
                components={{
                    Toolbar: GridToolbar,
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                loading={props.isFetching}
                rows={row}
                columns={columns}
                rowsPerPageOptions={[100,250,500,1000]}
                onCellEditCommit={handleEditCell}
            />
        </div>
    )
}