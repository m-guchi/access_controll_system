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
    {field: "pass_time", headerName: "時間", "width": 180, type: 'dateTime',},
    {field: "yoyaku_id", headerName: "予約ID", "width": 140},
    {field: "ticket_id", headerName: "入場券ID", "width": 140},
    {field: "gate_id", headerName: "受付ID", "width": 100, hide: true},
    {field: "gate_name", headerName: "受付名", "width": 200},
    {field: "out_area", headerName: "前(エリアID)", "width": 100, hide: true},
    {field: "out_area_name", headerName: "前(エリア名)", "width": 150},
    {field: "in_area", headerName: "次(エリアID)", "width": 100, hide: true},
    {field: "in_area_name", headerName: "次(エリア名)", "width": 150},
    {field: "user_id", headerName: "登録者ID", "width": 100 ,hide: true},
    {field: "user_name", headerName: "登録者名", "width": 140},
]

export default function LogGateTable (props) {

    const row = (!props.infoData.area || !props.logData) ? [] : props.logData.map(val => {
        val["id"] = val["pass_time"]+val["user_id"]+val["gate_id"];
        val["out_area_name"] = (val["out_area"] in props.infoData.area) ? props.infoData.area[val["out_area"]].area_name : null;
        val["in_area_name"] = (val["in_area"] in props.infoData.area) ? props.infoData.area[val["in_area"]].area_name : null;
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