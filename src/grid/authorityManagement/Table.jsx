import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton'


const columns = [
    {field: "authority_name", headerName: "権限名", width: 150},
    {field: "description", headerName: "説明", width: 200},
    {field: "group_list", headerName: "権限グループ", width: 400},
]

export default function AuthorityTable (props) {

    const handleRowSelect = (param) => {
        props.setSelectData(param.row);
    }

    const row = !props.data ? null : Object.keys(props.data).map((index,key) => {
        const data = props.data[index];
        data["id"] = data["authority_name"];
        data["group_list"] = !data["group"] ? null : data["group"].join(" / ");
        return data;
    })

    if(!props.data) return null;

    return(
        <PaperWrap>
            <DataGrid
                onRowClick={handleRowSelect}
                autoHeight
                rows={row}
                columns={columns}
            />
            <ReloadButton onClick={props.getAuthorityListData} />
        </PaperWrap>
    )
}