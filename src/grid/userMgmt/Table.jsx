import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton'


const columns = [
    {field: "user_id", headerName: "ユーザーID", width: 100, hide:true},
    {field: "login_id", headerName: "ログインID", width: 150},
    {field: "user_name", headerName: "ユーザー名", width: 180},
    {field: "authority_group", headerName: "権限グループ", width: 150},
    {field: "place_list", headerName: "使用場所", width: 350},
]

export default function UsersTable (props) {

    const handleRowSelect = (param) => {
        props.setSelectUserData(param.row);
    }

    const row = (!props.gateData || !props.usersData) ? [] : props.usersData.map(val => {
        val["id"] = val["user_id"];
        val["place_list"] = !val["gate_id_list"] ? null : val["gate_id_list"].map(item => {
            return props.gateData[item].gate_name;
        }).join(" / ")
        return val;
    })

    return(
        <PaperWrap>
            <DataGrid
                onRowClick={handleRowSelect}
                autoHeight
                rows={row}
                columns={columns}
            />
            <ReloadButton onClick={props.getUserListData} />
        </PaperWrap>
    )
}