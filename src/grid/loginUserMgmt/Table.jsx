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
    
    const row = (!props.userData) ? [] : Object.keys(props.userData).map(index => {
        const val = props.userData[index];
        val["id"] = val["login_user_id"];
        val["place_list"] = !val["gate_id_list"] ? null : val["gate_id_list"].map(item => {
            if(item in props.gateData){
                return props.gateData[item].gate_name;
            }else{
                return null;
            }
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
                loading={props.isFetching}
            />
            <ReloadButton onClick={props.getUserListData} />
        </PaperWrap>
    )
}