import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, InputLabel, Input, FormControlLabel, Checkbox, Grid } from '@material-ui/core'
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core'
import { Card, Typography, Divider } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    table: {
        width: "auto"
    },
    inputBox: {
        marginBottom: 5
    }
}));

export default function ScanBox (props) {
    const classes = useStyles();
    


    const handleRecordPassHistory = () => {
        props.toggleRecordPassHistory(!props.recordPassHistory)
    }

    return(
        <Card className={classes.root}>
            <Grid container className={classes.inputBox}>
                {Boolean(props.is_yoyaku) &&
                <Grid item xs={12}>
                <FormControl>
                    <InputLabel htmlFor="yoyaku_field">予約QRコード</InputLabel>
                    <Input
                        id="yoyaku_field"
                        inputRef={props.yoyakuEl}
                        variant="outlined"
                        type="search"
                    />
                </FormControl>
                </Grid>
                }
                <Grid item xs={12}>
                <FormControl>
                    <InputLabel htmlFor="ticket_field">入場券QRコード</InputLabel>
                    <Input
                        id="ticket_field"
                        inputRef={props.ticketEl}
                        variant="outlined"
                        type="search"
                    />
                </FormControl>
                </Grid>
                {props.inputState &&
                <Grid item xs={12}>
                    <Typography variant="body2" color="error">{props.inputState}</Typography>
                </Grid>
                }
                {Boolean(props.is_yoyaku)&&
                <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox
                        color="primary"
                        checked={props.recordPassHistory}
                        onChange={handleRecordPassHistory}
                    />}
                    label="通過記録をつける"
                />
                </Grid>
                }
            </Grid>
            <Divider />
            <TableContainer className={classes.table}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">属性</TableCell>
                            <TableCell align="center">メッセージ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">{props.attribute}</TableCell>
                            <TableCell align="center"><Typography color={props.submitState.error ? "error" : "primary"} variant="body2">{props.submitState.text}</Typography></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}