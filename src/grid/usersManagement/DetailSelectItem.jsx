import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TableRow, TableCell, IconButton, Select, MenuItem } from '@material-ui/core';
import { infoContext } from '../../context/info';
import { Edit as EditIcon, Clear as ClearIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    icon: {
        padding: theme.spacing(0.4),
    },
}));

export default function UsersDetailSelectItem (props) {
    const classes = useStyles();

    const [isEdit, toggleEdit] = useState(false)
    const [item, setItem] = useState(props.value)
    const infoData = useContext(infoContext)
    const authorityList = infoData ? infoData.authority : null;

    useEffect(() => {
        setItem(props.value)
    },[props.value])

    const handleItem = (e) => {
        setItem(e.target.value)
        toggleEdit(false);
        props.saveItem(e.target.value);
    }

    return(
        <TableRow>
            <TableCell>{props.name}</TableCell>
            {props.isDisable ? <TableCell colSpan={2}>{props.value}</TableCell> :
            <React.Fragment>
                <TableCell>
                {isEdit ?
                        <Select
                            value={item}
                            onChange={handleItem}
                        >
                            {authorityList && authorityList.map((item,index) => {
                                return <MenuItem key={index} value={item}>{item}</MenuItem>
                            })}
                        </Select>
                        :
                        props.value
                    }
                </TableCell>
                <TableCell align="right">
                    {props.canEdit &&
                    <IconButton className={classes.icon} onClick={()=>toggleEdit(!isEdit)}>
                        {isEdit ?
                            <ClearIcon fontSize="small"/>
                        :
                            <EditIcon fontSize="small"/>
                        }
                    </IconButton>
                    }
                </TableCell>
            </React.Fragment> 
            }
        </TableRow>
    )
}