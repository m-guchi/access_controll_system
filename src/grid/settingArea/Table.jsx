import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import PaperWrap from '../../templete/Paper';


const columns = [
    {field: "area_id", headerName: "ID", width: 100},
    {field: "area_name", headerName: "エリア名", width: 170},
]

export default function AreaTable (props) {

    const handleRowSelect = (param) => {
        props.setInputData({
            areaId: param.row.area_id,
            areaName: param.row.area_name,
            isExist: true,
        });
    }

    const row = !props.areaData ? [] : Object.keys(props.areaData).map((index) => {
        const val = props.areaData[index];
        val["id"] = val["area_id"]
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
        </PaperWrap>
    )
}