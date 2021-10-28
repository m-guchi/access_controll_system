import React from 'react'
import { Button } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';



export default function ReloadButton (props) {
    return(
        <Button color="primary" onClick={props.onClick} startIcon={<CachedIcon />}>更新</Button>
    )
}