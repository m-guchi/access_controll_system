import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import PaperWrap from '../../templete/Paper';


const columns = [
    {field: "gate_id", headerName: "ID", width: 100},
    {field: "gate_name", headerName: "受付名", width: 170},
    {field: "out_area_name", headerName: "前エリア", width: 120},
    {field: "in_area_name", headerName: "次エリア", width: 120},
    {field: "ticket", headerName: "発券所", width: 70},
]

export default function GateTable (props) {

    const handleRowSelect = (param) => {
        props.setInputData({
            gateId: param.row.gate_id,
            gateName: param.row.gate_name,
            outArea: param.row.out_area,
            inArea: param.row.in_area,
            isTicket: param.row.ticket_flag,
            isExist: true,
        });
    }

    const info = props.infoData;
    const row = !(info.gate && info.area) ? [] : Object.keys(info.gate).map((index) => {
        const val = info.gate[index];
        val["id"] = val["gate_id"];
        val["ticket"] = val["ticket_flag"] ? "発券所" : "";
        val["out_area_name"] = !info.area[val["out_area"]] ? null : info.area[val["out_area"]].area_name;
        val["in_area_name"] = !info.area[val["in_area"]] ? null : info.area[val["in_area"]].area_name;
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