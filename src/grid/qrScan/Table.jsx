import React from 'react'
import PaperWrap from '../../templete/Paper';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'


export default function VisitorHistoryTable (props) {
    if(!props.visitorHistory || !props.areaList) return null;
    return(
        <PaperWrap>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>時間</TableCell>
                        <TableCell align="center">受付</TableCell>
                        <TableCell align="center">エリア</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(props.visitorHistory) && props.visitorHistory.map(val => {
                        return (
                            <TableRow>
                                <TableCell>{val.pass_time}</TableCell>
                                <TableCell align="center">{val.gate_name}</TableCell>
                                <TableCell align="center">
                                    {props.areaList[val.out_area].area_name} → {props.areaList[val.in_area].area_name}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </PaperWrap>
    )
}