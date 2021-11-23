import React from 'react'
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { LinearProgress } from '@material-ui/core';


function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}

export default function Table (props) {

    const columns = [
        {field: "id", headerName: "ID", width: 250},
        {field: "value", headerName: "設定値", width: 180, editable: true},
        {field: "description", headerName: "説明", width: 1500},
    ]

    const handleCommitCell = (e) => {
        if(e.field==="value"){
            props.handleSettingData({
                id: e.id,
                value: e.value
            })
        }
    }

    const row = !props.data ? [] : Object.keys(props.data).map((index) => {
        const val = props.data[index];
        val["id"] = index
        return val;
    })

    return(
        <div>
            <DataGrid
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                autoHeight
                loading={props.isFetching}
                rows={row}
                columns={columns}
                onCellEditCommit={handleCommitCell}
            />
        </div>
    )
}