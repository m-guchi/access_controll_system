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
    {field: "time", headerName: "時間", "width": 180, type: 'dateTime',},
    {field: "yoyaku_id", headerName: "予約ID", "width": 140},
    {field: "ticket_id", headerName: "入場券ID", "width": 140},
    {field: "user_id", headerName: "登録者ID", "width": 100 ,hide: true},
    {field: "user_name", headerName: "登録者名", "width": 140},
]

export default function LogTicketTable (props) {

    const row = (!props.logData) ? [] : props.logData.map(val => {
        val["id"] = val["ticket_id"]+val["yoyaku_id"];
        return val;
    })

    return(
        <div style={{ height: '90vh'}}>
            <DataGrid
                components={{
                    Toolbar: GridToolbar,
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                loading={props.isFetching}
                rows={row}
                columns={columns}
            />
        </div>
    )
}