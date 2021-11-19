import React, { useState, useEffect, useContext } from 'react'
import { TableRow, TableCell, Select, MenuItem, Typography } from '@material-ui/core';
import { infoContext } from '../../context/info';

export default function SelectAuth (props) {
    const contextInfo = useContext(infoContext)
    const [item, setItem] = useState(props.value)

    useEffect(() => {
        setItem(props.value)
    },[props.value])

    const handleItem = (e) => {
        setItem(e.target.value)
        props.saveItem(e.target.value);
    }

    return(
        <TableRow>
            <TableCell>{props.name}</TableCell>
            {props.isDisable ? <TableCell colSpan={2}>{props.value}</TableCell> :
            <React.Fragment>
                <TableCell colSpan={2}>
                {props.canEdit ?
                        <Select
                            value={item}
                            onChange={handleItem}
                        >
                            {contextInfo.data.auth_list && Object.keys(contextInfo.data.auth_group).map((item,index) => {
                                return <MenuItem key={index} value={item}>{item}</MenuItem>
                            })}
                        </Select>
                        :
                        <>
                            <Typography>{props.value}</Typography>
                            <Typography color="secondary" variant="body2">自分の権限グループは変更できません</Typography>
                        </>
                    }
                </TableCell>
            </React.Fragment> 
            }
        </TableRow>
    )
}