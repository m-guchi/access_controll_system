import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
        '& > *': {
            margin: theme.spacing(1)
        }
    },
}));

export default function FormBox (props) {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            {props.children}
        </div>
    )
}