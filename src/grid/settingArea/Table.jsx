import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { AlertBarContext } from '../../context/AlertBarContext';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { Modal, LinearProgress, Button, Typography } from '@material-ui/core';


function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}

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

export default function AreaTable (props) {
    const classes = useStyles();

    const [deleteAreaId, setDeleteAreaId] = useState(null);

    const columns = [
        {field: "id", headerName: "ID", width: 100},
        {field: "area_name", headerName: "エリア名", width: 170, editable: true},
        {field: "capacity", headerName: "定員", width: 120, type:"number", editable: true},
        {field: "hide_dis", headerName: "表示", width: 120, type:"boolean", editable: true ,description:"会場内人数などのグラフに表示するか"},
        {field: "delete", headerName: "削除", width: 120, renderCell: (params) => {
            return(
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={()=>hancleDeleteButton(params.id)}
                >
                    削除
                </Button>
            )
        }},
    ]

    const contextAlertBar = useContext(AlertBarContext);
    
    const handleCommitCell = (e) => {
        if(e.field==="hide_dis"){
            putAreaData({
                area_id: e.id,
                hide: !e.value
            })
        }else{
            if(e.field==="capacity" && (e.value<0 || e.value>1000000)){
                contextAlertBar.setWarning("定員は0以上1,000,000以下の値を入力してください")
            }else if(e.field==="area_name" && (e.value.length<=0 || e.value.length>50)){
                contextAlertBar.setWarning("エリア名は1文字以上50文字以下で入力してください")
            }else{
                putAreaData({
                    area_id: e.id,
                    [e.field]: e.value
                })
            }
        }
    }

    const putAreaData = (data) => {
        props.handleAreaData(data)
    }

    const [confirmDeleteOpen, toggleConfirmDeleteOpen] = useState(false);
    const handleConfirmDeleteClose = () => toggleConfirmDeleteOpen(false);
    const hancleDeleteButton = (areaId) => {
        setDeleteAreaId(areaId)
        toggleConfirmDeleteOpen(true);
    }
    const handleConfirmDeleteButton = () => {
        props.handleDeleteAreaData(deleteAreaId);
        setDeleteAreaId(null);
        handleConfirmDeleteClose();
    }


    const row = !props.areaData ? [] : Object.keys(props.areaData).map((index) => {
        const val = props.areaData[index];
        val["id"] = val["area_id"]
        val["hide_dis"] = !Boolean(Number(val["hide"]));
        return val;
    })

    return(
        <div>
            <Modal
                open={confirmDeleteOpen}
                onClose={handleConfirmDeleteClose}
                className={classes.modal}
            >
                <div className={classes.paper}>
                    <Typography variant="h6">本当に削除しますか</Typography>
                    <Typography variant="body2">削除すると、このエリアに関する情報が閲覧できなくなる場合があります。</Typography>
                    <Button variant="contained" onClick={handleConfirmDeleteButton} color="secondary">削除する</Button>
                    <Button variant="contained" onClick={handleConfirmDeleteClose}>キャンセル</Button>
                </div>
            </Modal>
            <DataGrid
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                autoHeight
                loading={props.isFetching}
                rows={row}
                columns={columns}
                onCellEditCommit={handleCommitCell}
                rowsPerPageOptions={[]}
                hideFooterSelectedRowCount
            />
        </div>
    )
}