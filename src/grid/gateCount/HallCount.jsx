import React from 'react'
import PaperWrap from '../../templete/Paper';
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    numeric: {
        marginTop: theme.spacing(1)
    },
    number: {
        fontSize: "1.4em",
        padding: theme.spacing(1),
    },
    street: {
        fontSize: "1.8em",
        fontWeight: "bold"
    }
}));

export default function HallCount (props) {
    const classes = useStyles();

    if(!props.visitorsCount || !props.gateCount || !props.gateInfo) return null;

    const indoorNum = props.visitorsCount["P001"].count;
    const indoorSum = indoorNum.x+indoorNum.y;

    const roomSum = Object.keys(props.gateCount).reduce((sum,key) => {
        const val = props.gateCount[key]
        const gateDetail = props.gateInfo[key]
        if(gateDetail.in_area==="P001" && gateDetail.out_area==="P001"
             && gateDetail.in_area!=="P004" && gateDetail.out_area!=="P004"
             && gateDetail.in_area!=="P005" && gateDetail.out_area!=="P005"
        ){
            return sum + val.count.x + val.count.y;
        }else{
            return sum;
        }
    },0);

    return(
        <PaperWrap>
            <Typography variant="h6">館内廊下人数(推定)</Typography>
            <Typography variant="caption">団体関係者を除く</Typography>
            <Typography className={classes.numeric}>
                <span className={classes.number}>{indoorSum}</span> － 
                <span className={classes.number}>{roomSum}</span> ＝ 
                <span className={classes.number + " " + classes.street}>{indoorSum-roomSum}</span>
            </Typography>
            <Typography variant="caption">(館内人数) － (教室受付通過数)</Typography>
        </PaperWrap>
    )
}