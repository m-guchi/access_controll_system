import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(0.8),
    },
}));

export default function PaperWrap (props) {
    const classes = useStyles();
    return(
        <Paper className={classes.paper}>
            {props.children}
        </Paper>
    )
}