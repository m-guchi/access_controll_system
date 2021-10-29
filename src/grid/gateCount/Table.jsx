import React from 'react'
import { Table, TableHead, TableCell, TableRow, TableBody, Typography } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton';

export default function CountTable (props) {

    if(!props.gateCount) return null;
    return(
        <PaperWrap>
            <Typography variant="body2">({props.periodMinute}分前から通過した人数)</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">受付名</TableCell>
                        {
                            Object.keys(props.infoData.attribute).map((val) => {
                                return <TableCell align="center">{props.infoData.attribute[val].name}</TableCell>
                            })
                        }
                        <TableCell align="center">合計人数</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {Object.keys(props.gateCount).map((index) => {
                    const row = props.gateCount[index];
                    const gateDetail = props.infoData.gate[index];
                    if(!gateDetail) return null;
                    const gateName = gateDetail.gate_name;
                    let sumNum = 0;
                    return (
                        <TableRow key={row.area_id}>
                            <TableCell align="center">{gateName}</TableCell>
                            {
                                Object.keys(props.infoData.attribute).map((val) => {
                                    sumNum += row[val];
                                    return <TableCell align="center">{row[val]}</TableCell>
                                })
                            }
                            <TableCell align="center">{sumNum}</TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
            <ReloadButton onClick={()=>props.getGateCount(props.token)} />
        </PaperWrap>
    )
}