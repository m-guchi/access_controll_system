import React from 'react'
import { Table, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton';

export default function CountTable (props) {

    if(!props.visitorsCount) return null;
    return(
        <PaperWrap>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">エリア名</TableCell>
                        <TableCell align="center">来場者(阪大生)</TableCell>
                        <TableCell align="center">来場者(一般)</TableCell>
                        <TableCell align="center">団体関係者</TableCell>
                        <TableCell align="center">合計人数</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {Object.keys(props.visitorsCount).map((index) => {
                    const row = props.visitorsCount[index];
                    return (
                        <TableRow key={row.area_id}>
                            <TableCell align="center">{row.area_name}</TableCell>
                            <TableCell align="center">{row.count.x}</TableCell>
                            <TableCell align="center">{row.count.y}</TableCell>
                            <TableCell align="center">{row.count.z}</TableCell>
                            <TableCell align="center">{row.count.sum}</TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
            <ReloadButton onClick={()=>props.getVisitorsCount(props.token)} />
        </PaperWrap>
    )
}