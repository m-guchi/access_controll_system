import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography } from '@material-ui/core'
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5,
        width: "auto"
    },
}));

export default function ScanList (props) {
    const classes = useStyles();

    const areaSearchById = (id) => props.areaInfo.find((val) => {
        return (val.id === id);
    })

    return(
        <Card className={classes.root}>
            <TableContainer component={Paper} className={classes.table}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>時間</TableCell>
                            <TableCell align="center">出場</TableCell>
                            <TableCell align="center">入場</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(props.userHistory && props.areaInfo) && props.userHistory.map(val => {
                            if(val.kind==="gate"){
                                return (
                                    <TableRow>
                                        <TableCell>{val.time}</TableCell>
                                        <TableCell align="center">{areaSearchById(val.out).name}</TableCell>
                                        <TableCell align="center">{areaSearchById(val.in).name}</TableCell>
                                    </TableRow>
                                )
                            }else if(val.kind==="yoyaku"){
                                return (
                                    <TableRow>
                                        <TableCell>{val.time}</TableCell>
                                        <TableCell align="center" colSpan={2}>入場券発行<br/>({val.ticket})</TableCell>
                                    </TableRow>
                                )
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}