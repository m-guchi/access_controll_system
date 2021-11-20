import React, { useState, useEffect, useContext } from 'react'
import { Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { SnackbarContext } from '../context/AlertBarContext';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AlertBar (props) {
    const { snackState, toggleSnack } = useContext(SnackbarContext);

    const handleClose = (e,res) => {
        if(res==="clickaway"){
            return;
        }
        toggleSnack(false, snackState.type, "");
    }

    return(
        <Snackbar open={snackState.isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackState.type}>
                {snackState.message}
            </Alert>
        </Snackbar>
    )
}