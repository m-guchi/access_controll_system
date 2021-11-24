import React, { useContext } from 'react'
import { infoContext } from '../../context/info';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton'


function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}

export default function AuthTable (props) {
    const contextInfo = useContext(infoContext);

    const columns = [
        {field: "id", headerName: "権限名", width: 150},
        {field: "description", headerName: "説明", width: 170},
    ]

    Object.keys(contextInfo.data.auth_group).forEach(val => {
        columns.push({field:val, headerName:val, width: 130, type: "boolean", editable: true })
    })

    const row = contextInfo.data.auth_list.map(val => {
        val["id"] = val["auth_name"];
        Object.keys(contextInfo.data.auth_group).forEach(authGroup => {
            val[authGroup] = contextInfo.data.auth_group[authGroup].includes(val["id"])
        })
        return val;
    })

    const handleEditCell = (e) => {
        const authName = e.id;
        const authGroup = e.field;
        const value = e.value;
        if(authName && authGroup){
            props.handleChangeAuth(authName, authGroup, value);
        }
    }

    return(
        <PaperWrap>
            <DataGrid
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                autoHeight
                loading={props.isFetching}
                rows={row}
                columns={columns}
                onCellEditCommit={handleEditCell}
            />
            <ReloadButton onClick={props.fetchInfoData} />
        </PaperWrap>
    )
}