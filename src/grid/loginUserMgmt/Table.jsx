import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton'


const columns = [
    {field: "id", headerName: "ID", width: 100, hide:true},
    {field: "login_id", headerName: "ログインID", width: 200},
    {field: "login_user_name", headerName: "表示名", width: 200},
    {field: "auth_group", headerName: "権限グループ", width: 180},
]

export default function UsersTable (props) {

    const handleRowSelect = (param) => {
        props.setSelectUserData(param.row);
    }
    
    const row = (!props.loginUserData) ? [] : Object.keys(props.loginUserData).map(index => {
        const val = props.loginUserData[index];
        val["id"] = val["login_user_id"];
        return val;
    })
    
    return(
        <PaperWrap>
            <ReloadButton onClick={props.handleGetLoginUser} />
            <DataGrid
                onRowClick={handleRowSelect}
                autoHeight
                rows={row}
                columns={columns}
                loading={props.isFetching}
            />
        </PaperWrap>
    )
}