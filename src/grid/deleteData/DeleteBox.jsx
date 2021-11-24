import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Button, TextField, Modal } from '@material-ui/core';
import { AlertBarContext } from '../../context/AlertBarContext';
import PaperWrap from '../../templete/Paper';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        "& > *": {
            margin: theme.spacing(1),
        }
    },
}));

export default function DeleteBox (props) {
    const classes = useStyles();
    const contextAlertBar = useContext(AlertBarContext);

    const [deleteDate, setDeleteDate] = useState(null);
    const [modalOpen, toggleModalOpen] = useState(false);

    const deleteDateFormat = {
        day: deleteDate ? deleteDate.slice(0,10) : null,
        time: deleteDate ? deleteDate.slice(11) : null
    }

    const handleDeleteDate = (e) => setDeleteDate(e.target.value);
    const handleDeleteButton = () => {
        if(deleteDate){
            toggleModalOpen(true);
        }else{
            contextAlertBar.setWarning("日時を指定してください。")
        }
    }
    const handleDeleteConfirmButton = () => {
        props.handleDelete(props.type, deleteDate)
        handleModalClose();
    }
    const handleModalClose = () => toggleModalOpen(false);

    return(
        <PaperWrap>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                className={classes.modal}
            >
                <div className={classes.paper}>
                    <Typography variant="h6">本当に削除しますか</Typography>
                    <Typography variant="body1" color="secondary">{deleteDateFormat.day} {deleteDateFormat.time} 以前のデータが削除されます</Typography>
                    <Typography variant="body2">{props.deleteAlert}</Typography>
                    <Button variant="contained" onClick={handleDeleteConfirmButton} color="secondary">削除する</Button>
                    <Button variant="contained" onClick={handleModalClose}>キャンセル</Button>
                </div>
            </Modal>
            <Typography variant="h6">{props.title}</Typography>
            <Typography>{props.describe}</Typography>
            <Typography><TextField
                label="削除日時"
                variant="outlined"
                type="datetime-local"
                InputLabelProps={{
                    shrink: true,
                }}
                value={deleteDate}
                onChange={handleDeleteDate}
            /></Typography>
            <Button color="secondary" variant="contained" onClick={handleDeleteButton}>
                削除
            </Button>
        </PaperWrap>
    )
}