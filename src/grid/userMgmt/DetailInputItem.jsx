import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, TableRow, TableCell, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Clear as ClearIcon, Save as SaveIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    icon: {
        padding: theme.spacing(0.4),
    },
}));

export default function UsersDetailInputItem (props) {
    const classes = useStyles();

    const [isEdit, toggleEdit] = useState(false)
    const [text, setText] = useState(props.value)

    useEffect(() => {
        setText(props.value)
    },[props.value])

    const handleText = (e) => setText(e.target.value)

    const saveText = () => {
        toggleEdit(false);
        props.saveEdit(text);
        setText(props.value)
    }

    return(
        <TableRow>
            <TableCell>{props.name}</TableCell>
            {props.isDisable ? <TableCell colSpan={2}>{props.value}</TableCell> :
            <React.Fragment>
                <TableCell>
                {isEdit ?
                        <React.Fragment>
                            <TextField
                                size="small"
                                value={text}
                                onChange={handleText}
                            />
                            <IconButton onClick={saveText}>
                                <SaveIcon fontSize="small" color="primary" />
                            </IconButton>
                        </React.Fragment>
                        :
                        props.value
                    }
                </TableCell>
                <TableCell align="right">
                    <IconButton className={classes.icon} onClick={()=>toggleEdit(!isEdit)}>
                        {isEdit ?
                            <ClearIcon fontSize="small"/>
                        :
                            <EditIcon fontSize="small"/>
                        }
                    </IconButton>
                </TableCell>
            </React.Fragment> 
            }
        </TableRow>
    )
}