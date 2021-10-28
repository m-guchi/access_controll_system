import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ReactLoading from 'react-loading';
import QrReader from 'react-qr-reader'
import PaperWrap from '../../templete/Paper';

const useStyles = makeStyles((theme) => ({
    box: {
        position: "relative",
        width: '100%',
        paddingTop: '100%'
    },
    content: {
        position: "absolute",
        top: "25%",
        left: "25%",
        width: "100%",
        textAlign: "center",
    }
}));
 
export default function Scan (props) {
    const classes = useStyles();
    
    const handleError = err => {
        console.error(err)
    }

    return (
    <PaperWrap>
        {props.canUseScan ?
        <QrReader
            delay={700}
            onError={handleError}
            onScan={props.handleScan}
            style={{ width: '100%' }}
        />
        :
        <div className={classes.box} >
            <div className={classes.content}>
                <ReactLoading type="spin" height="50%" width="50%" color="#3f51b5" className={classes.animation}/>
            </div>
        </div>
        }
    </PaperWrap>
    )
}