import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';
import { DataGrid, GridToolbar, GridOverlay } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom'



function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

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
    {field: "id", headerName: "ユーザーID", width: 200},
    {field: "delete", headerName: "通過記録", width: 150, renderCell: (params) => {
        return(
            <Button
                to={"/log_user_pass?user_id="+params.id}
                component={Link}
                variant="outlined"
                color="primary"
                target="_blank"
            >
                通過記録
            </Button>
        )
    }},
]

export default function UserSearchTable (props) {

    const row = [];
    if(props.userList){
        props.userList.forEach(val => {
            row.push({id:val})
        })
    }

    return(
        <div style={{ height: '80vh'}}>
            <DataGrid
                components={{
                    Toolbar: GridToolbar,
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                loading={props.isFetching}
                rows={row}
                columns={columns}
                rowsPerPageOptions={[100,250,500,1000]}
            />
        </div>
    )
}