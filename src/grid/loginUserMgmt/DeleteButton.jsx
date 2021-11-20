import React from 'react'
import {  TableRow, TableCell, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export default function DeleteButton (props) {

    return(
        <TableRow>
            <TableCell></TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={props.handleDeleteLoginUser}
                >削除</Button>
            </TableCell>
        </TableRow>
    )
}