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
    {field: "time", headerName: "通過時間", "width": 200, type: 'dateTime',},
    {field: "user_id", headerName: "ユーザーID", "width": 200},
    {field: "out_area", headerName: "前(エリアID)", "width": 100, hide: true},
    {field: "out_area_name", headerName: "前(エリア名)", "width": 180},
    {field: "in_area", headerName: "次(エリアID)", "width": 100, hide: true},
    {field: "in_area_name", headerName: "次(エリア名)", "width": 180},
]

export default function LogGateTable (props) {
    const row = (!props.areaData || !props.logData) ? [] : props.logData.map(val => {
        val["id"] = val["time"]+val["user_id"];
        val["out_area_name"] = (val["out_area"] in props.areaData) ? props.areaData[val["out_area"]].area_name : null;
        val["in_area_name"] = (val["in_area"] in props.areaData) ? props.areaData[val["in_area"]].area_name : null;
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