import React, { useState, useEffect, useContext } from 'react'
import { Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertBarContext} from '../context/AlertBarContext';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AlertBar (props) {
    const contextAlertBar = useContext(AlertBarContext);

    const handleClose = (e,res) => {
        if(res==="clickaway"){
            return;
        }
        contextAlertBar.set(false, contextAlertBar.data.type, "");
    }

    return(
        <Snackbar open={contextAlertBar.data.isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={contextAlertBar.data.type}>
                {contextAlertBar.data.message}
            </Alert>
        </Snackbar>
    )
}