import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { infoContext } from '../../context/info';
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

export default function Table (props) {
    const classes = useStyles();

    const [deleteGateId, setDeleteGateId] = useState(null);

    const columns = [
        {field: "id", headerName: "ID", width: 100},
        {field: "gate_name", headerName: "受付名", width: 170, editable: true},
        {field: "out_area", headerName: "前エリアID", width: 140, editable: true},
        {field: "out_area_name", headerName: "前エリア名", width: 160},
        {field: "in_area", headerName: "次エリアID", width: 140, editable: true},
        {field: "in_area_name", headerName: "次エリア名", width: 160},
        {field: "can_make_ticket_dis", headerName: "紐付け", width: 120, type:"boolean", editable: true, description:"チケットとユーザーIDを紐付け可能(チケットを使用しない場合は✕にする)"},
        {field: "delete", headerName: "削除", width: 120, renderCell: (params) => {
            setDeleteGateId(params.id)
            return(
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={hancleDeleteButton}
                >
                    削除
                </Button>
            )
        }},
    ]

    const contextAlertBar = useContext(AlertBarContext);
    const contextInfo= useContext(infoContext);

    const handleCommitCell = (e) => {
        console.log(e)
        if(e.field==="can_make_ticket_dis"){
            putGateData({
                gate_id: e.id,
                can_make_ticket: e.value
            })
        }else{
            putGateData({
                gate_id: e.id,
                [e.field]: e.value
            })
        }
    }

    const putGateData = (data) => {
        props.handleGateData(data)
    }

    const [confirmDeleteOpen, toggleConfirmDeleteOpen] = useState(false);
    const handleConfirmDeleteClose = () => toggleConfirmDeleteOpen(false);
    const hancleDeleteButton = () => toggleConfirmDeleteOpen(true);
    const handleConfirmDeleteButton = () => {
        props.handleDeleteGateData(deleteGateId);
        setDeleteGateId(null);
        handleConfirmDeleteClose();
    }


    const row = !props.gateData ? [] : Object.keys(props.gateData).map((index) => {
        const val = props.gateData[index];
        val["id"] = val["gate_id"]
        val["can_make_ticket_dis"] = Boolean(Number(val["can_make_ticket"]));
        const areaData = contextInfo.data.area;
        val["in_area_name"] = (areaData && val["in_area"] in areaData) ? areaData[val["in_area"]].area_name : null;
        val["out_area_name"] = (areaData && val["out_area"] in areaData) ? areaData[val["out_area"]].area_name : null;
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
                    <Typography variant="body2">削除すると、この受付に関する情報が閲覧できなくなる場合があります。</Typography>
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
            />
        </div>
    )
}