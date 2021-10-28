import React from 'react'
import { makeStyles} from '@material-ui/core/styles'
import { Grid, Switch, Typography } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';


const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: "center",
    },
}));

export default function SwitchScanMode (props) {
    const classes = useStyles();
    const nextDevice = !(props.isDevice==="sm")?"sm":"pc";
    
    if(!props.isDevice) return null;
    return(
        <PaperWrap>
            <Typography variant="body2">
                <Grid component="label" container alignItems="center" spacing={1} className={classes.root}>
                    <Grid item>PC<br />(外付けリーダー)</Grid>
                    <Grid item>
                        <Switch
                            checked={Boolean(props.isDevice==="sm")}
                            onChange={()=>props.toggleDevice(nextDevice)}
                        />
                    </Grid>
                    <Grid item>スマホ<br />(内部カメラ)</Grid>
                </Grid>
            </Typography>
        </PaperWrap>
    )
}