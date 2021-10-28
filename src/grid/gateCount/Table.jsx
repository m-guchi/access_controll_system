import React from 'react'
import { Table, TableHead, TableCell, TableRow, TableBody, Typography } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton';

export default function CountTable (props) {

    if(!props.gateCount || !props.gateInfo) return null;
    return(
        <PaperWrap>
            <Typography variant="body2">({props.periodMinute}分前から通過した人数)</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">受付名</TableCell>
                        <TableCell align="center">来場者(阪大生)</TableCell>
                        <TableCell align="center">来場者(一般)</TableCell>
                        <TableCell align="center">団体関係者</TableCell>
                        <TableCell align="center">合計人数</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {Object.keys(props.gateCount).map((index) => {
                    const row = props.gateCount[index];
                    const gateDetail = props.gateInfo[row.gate_id];
                    const gateName = gateDetail.gate_name;
                    // if(gateDetail.in_area!=="P001" || gateDetail.out_area!=="P001") return null;
                    return (
                        <TableRow key={row.area_id}>
                            <TableCell align="center">{gateName}</TableCell>
                            <TableCell align="center">{row.count.x}</TableCell>
                            <TableCell align="center">{row.count.y}</TableCell>
                            <TableCell align="center">{row.count.z}</TableCell>
                            <TableCell align="center">{row.count.sum}</TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
            <ReloadButton onClick={()=>props.getGateCount(props.token)} />
        </PaperWrap>
    )
}