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
                        {
                            Object.keys(props.infoData.attribute).map((val) => {
                                return <TableCell align="center">{props.infoData.attribute[val].name}</TableCell>
                            })
                        }
                        <TableCell align="center">合計人数</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {Object.keys(props.visitorsCount).map((index) => {
                    const row = props.visitorsCount[index];
                    const areaDetail = props.infoData.area[index];
                    if(!areaDetail) return null;
                    if(areaDetail.hide_chart) return null;
                    const areaName = areaDetail.area_name;
                    let sumNum = 0;
                    return (
                        <TableRow key={index}>
                            <TableCell align="center">{areaName}</TableCell>
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
            <ReloadButton onClick={()=>props.getVisitorsCount(props.token)} />
        </PaperWrap>
    )
}