import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PaperWrap from '../../templete/Paper';
import { Typography } from '@material-ui/core';
import { attributeList } from '../../data/attribute'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

const useStyles = makeStyles((theme) => ({
    icon: {
        fontSize: 130
    }
}));

export default function VisitorDetail (props) {
    const classes = useStyles();

    const visitor = props.postVisitorData

    if(!visitor && !props.errorText) return null;

    return(
        <PaperWrap>
            {!props.errorText
                ? <CheckCircleOutlineIcon color="primary" className={classes.icon} />
                : <NotInterestedIcon color="error" className={classes.icon} />
            }
            {!props.errorText ?
                <React.Fragment>
                    <Typography variant="h6">【属性】{attributeList[visitor.attribute]}</Typography>
                    {props.canVisitorsHistory && <Typography>【予約ID】{visitor.yoyaku_id}</Typography>}
                </React.Fragment>
                :
                <Typography color="error">{props.errorText}</Typography>
            }
        </PaperWrap>
    )
}