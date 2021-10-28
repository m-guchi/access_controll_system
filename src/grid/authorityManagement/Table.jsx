import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton'


const columns = [
    {field: "authority_name", headerName: "権限名", width: 150},
    {field: "description", headerName: "説明", width: 200},
    {field: "group_list", headerName: "権限グループ", width: 300},
    // {field: "user_id", headerName: "ユーザーID", width: 100, hide:true},
    // {field: "login_id", headerName: "ログインID", width: 150},
    // {field: "user_name", headerName: "ユーザー名", width: 180},
    // {field: "authority_group", headerName: "権限グループ", width: 150},
    // {field: "place_list", headerName: "使用場所", width: 350},
]

export default function AuthorityTable (props) {

    // const handleRowSelect = (param) => {
    //     props.setSelectUserData(param.row);
    // }

    const row = !props.data ? null : Object.keys(props.data).map((index,key) => {
        const data = props.data[index];
        data["id"] = data["authority_name"];
        data["group_list"] = !data["group"] ? null : data["group"].join(" / ");
        return data;
    })

    // const row = (!props.data || !props.usersData) ? [] : props.data.map(val => {
    //     val["id"] = val["authority_name"];
    //     val["place_list"] = !val["place"] ? null : val["place"].map(item => {
    //         return props.gateData[item].gate_name;
    //     }).join(" / ")
    //     return val;
    // })

    if(!props.data) return null;

    return(
        <PaperWrap>
            <DataGrid
                // onRowClick={handleRowSelect}
                autoHeight
                rows={row}
                columns={columns}
            />
            {/* <ReloadButton onClick={props.getUserListData} /> */}
        </PaperWrap>
    )
}