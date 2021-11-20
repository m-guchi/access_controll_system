import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core';
import { infoContext } from '../../context/info';
import ReloadButton from '../../atoms/ReloadButton';
import PaperWrap from '../../templete/Paper';

const useStyles = makeStyles((theme) => ({
    red: {
        backgroundColor: "#e96a5f"
    },
    yellow: {
        backgroundColor: "#e9cb5f"
    },
}));

export default function CountTable (props) {
    const classes = useStyles();
    const contextInfo = useContext(infoContext)

    if(!props.userCount) return null;
    return(
        <PaperWrap>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">エリア名</TableCell>
                        <TableCell align="center">会場内人数</TableCell>
                        <TableCell align="center">定員に対する割合</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {Object.keys(contextInfo.data.area).map((areaId) => {
                    const areaData = contextInfo.data.area[areaId];
                    const count = (props.userCount[areaId]) ? props.userCount[areaId] : {total:0};
                    if(Boolean(Number(areaData.hide))) return null;
                    const rate = ((count.total/areaData.capacity)*100).toFixed(3);
                    let rowClass = "";
                    if(rate >= Number(contextInfo.data.setting.user_count_red_rate.value)){
                        rowClass = classes.red;
                    }else if(rate >= Number(contextInfo.data.setting.user_count_yellow_rate.value)){
                        rowClass = classes.yellow;
                    }
                    return (
                        <TableRow key={areaId} className={rowClass}>
                            <TableCell align="left">{areaData.area_name} ( {areaId} )</TableCell>
                            <TableCell align="center">{count.total} / {areaData.capacity}</TableCell>
                            <TableCell align="center">{rate} %</TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
            <ReloadButton onClick={props.handleGetUserCount} />
        </PaperWrap>
    )
}