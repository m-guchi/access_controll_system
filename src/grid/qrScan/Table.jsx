import React, { useContext } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { infoContext } from '../../context/info';
import PaperWrap from '../../templete/Paper';


export default function UserHistoryTable (props) {
    const contextInfo = useContext(infoContext);
    const areaData = contextInfo.data.area;
    if(!props.userPass) return null;
    return(
        <PaperWrap>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>時間</TableCell>
                        <TableCell align="center" colSpan={3}>移動 (表示数100件まで)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(props.userPass) && props.userPass.map(val => {
                        return (
                            <TableRow>
                                <TableCell>{val.time}</TableCell>
                                <TableCell align="center">{areaData[val.out_area].area_name}</TableCell>
                                <TableCell align="center">→</TableCell>
                                <TableCell align="center">{areaData[val.in_area].area_name}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </PaperWrap>
    )
}