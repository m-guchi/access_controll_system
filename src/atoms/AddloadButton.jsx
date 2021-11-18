import React from 'react'
import { Button } from '@material-ui/core';
import QueueIcon from '@material-ui/icons/Queue';



export default function AddloadButton (props) {
    return(
        <Button color="primary" onClick={props.onClick} startIcon={<QueueIcon />}>データ追加</Button>
    )
}