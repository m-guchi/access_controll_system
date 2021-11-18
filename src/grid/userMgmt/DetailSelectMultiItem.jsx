import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { infoContext } from '../../context/info';
import { TableRow, TableCell, IconButton, Checkbox, Grid } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, FormControl, FormControlLabel } from '@material-ui/core';
import { Edit as EditIcon, Clear as ClearIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    icon: {
        padding: theme.spacing(0.4),
    },
    dialogBox: {
        margin: theme.spacing(2),
    },
    gridContainer: {
        textAlign: "left",
    },
}));

export default function UsersDetailSelectMultiItem (props) {
    const classes = useStyles();

    const [isEdit, toggleEdit] = useState(false)
    const [items, setItems] = useState(props.value)

    const info = useContext(infoContext)
    const gateList = info ? info.gate : null;

    useEffect(() => {
        setItems(props.value)
    },[props.value, isEdit])

    const handleCheckBox = (e) => {
        if(e.target.checked){
            let arr = items.concat();
            arr.push(e.target.name)
            props.postItem(e.target.name);
            setItems(arr)
        }else{
            const arr = items.filter(v => v !== e.target.name);
            props.deleteItem(e.target.name)
            setItems(arr)
        }
    }

    const handleClose = () => toggleEdit(false)

    return(
        <TableRow>
            <TableCell>{props.name}</TableCell>
            {props.isDisable ? <TableCell colSpan={2}>{props.value}</TableCell> :
            <React.Fragment>
                <Dialog open={isEdit} onClose={handleClose} className={classes.dialogBox}>
                    <DialogTitle>使用場所</DialogTitle>
                    <DialogContent>
                        <FormControl>
                            <Grid container className={classes.gridContainer}>
                                {gateList && Object.keys(gateList).map((key,index) => {
                                    const item = gateList[key];
                                    return (
                                        <Grid item sm={6} xs={12}>
                                            <FormControlLabel
                                                key={index}
                                                control={<Checkbox name={item.gate_id} />}
                                                label={item.gate_name}
                                                onChange={handleCheckBox}
                                                checked={items.indexOf(item.gate_id)>-1}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </FormControl>
                    </DialogContent>
                </Dialog>
                <TableCell>
                    {
                        props.value && props.value.map((str) => (
                            <React.Fragment>{gateList[str].gate_name}({str})<br /></React.Fragment>
                        ))
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