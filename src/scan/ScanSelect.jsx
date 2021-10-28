import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, InputLabel, Select, ListSubheader, MenuItem } from '@material-ui/core'
import { Card, Typography } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function ScanSelect (props) {
    const classes = useStyles();

    const areaJson = props.areaInfo;
    const gateJson = props.gateInfo;

    const handleChangeGate = (e) => {
        if(!e.target.value){props.setGateData(null)}
        console.log(e.target.value)
        console.log(gateSearchById(e.target.value))
        props.setGateData(gateSearchById(e.target.value))
    }

    const gateSearchById = (id) => gateJson.find((val) => {
        return (val.id === id);
    })
    const areaSearchById = (id) =>  areaJson.find((val) => {
        return (val.id === id);
    })

    const hakkenList = gateJson.filter((val) => {
        return (val.is_yoyaku === 1);
    })
    const uketukeList = gateJson.filter((val) => {
        return (val.is_yoyaku === 0);
    })

    return(
        <Card className={classes.root}>
            <Typography>QRコード読み取り</Typography>
            <FormControl className={classes.formControl}>
                <InputLabel id="gate_select">発券所・受付</InputLabel>
                <Select
                    labelId="gate_select"
                    id="demo-simple-select"
                    onChange={handleChangeGate}
                >
                    <ListSubheader>発券所</ListSubheader>
                    {hakkenList.map((val) => (
                        <MenuItem key={val.id} value={val.id}>{val.name}</MenuItem>
                    ))}
                    <ListSubheader>受付</ListSubheader>
                    {uketukeList.map((val) => (
                        <MenuItem key={val.id} value={val.id}>{val.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {props.gateData &&
                <Typography variant="body2">{areaSearchById(props.gateData.p_out).name}→{areaSearchById(props.gateData.p_in).name}</Typography>
            }
        </Card>
    )
}