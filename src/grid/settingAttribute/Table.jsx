import React, { useState, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Modal, LinearProgress, Button, Typography } from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { infoContext } from '../../context/info';
import { AlertBarContext } from '../../context/AlertBarContext';
import PrefixBox from './PrefixBox';

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

    const [deleteAttributeId, setDeleteAttributeId] = useState(null);

    const columns = [
        {field: "id", headerName: "ID", width: 100},
        {field: "attribute_name", headerName: "属性名", width: 200, editable: true},
        {field: "prefix_list", headerName: "プレフィックス", width: 300, editable: true},
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
    const contextInfo= useContext(infoContext);

    const [prefixData, setPrefixData] = useState({attribute_id:null,prefix:[]});
    const [prefixOpen, togglePrefixOpen] = useState(false);
    const handleColorPickerClose = () => togglePrefixOpen(false);

    useEffect(() => {
        if(prefixOpen){
            setPrefixData({...prefixData ,prefix:props.attributeData[prefixData.attribute_id].prefix})
        }
    },[props.attributeData])

    const handleEditCell = (e) => {
        if(e.field==="prefix_list"){
            setPrefixData({attribute_id:e.id,prefix:props.attributeData[e.id].prefix})
            togglePrefixOpen(true)
        }
    }
    const handleCommitCell = (e) => {
        if(e.field!=="prefix_list"){
            if((e.field==="attribute_name" && (e.value.length<=0 || e.value.length>24))){
                contextAlertBar.setWarning("属性名は1文字以上24文字以下で入力してください")
            }else{
                putAttributeData({
                    attribute_id: e.id,
                    [e.field]: e.value
                })
            }
        }
    }

    const putAttributeData = (data) => {
        props.handleAttributeData(data)
    }
    const handleDeletePrefix = (prefix) => {
        props.handleDeletePrefixData(prefixData.attribute_id, prefix)
    }
    const handleRegisterPrefix = (prefix) => {
        props.handleRegisterPrefixData(prefixData.attribute_id, prefix)
    }

    const [confirmDeleteOpen, toggleConfirmDeleteOpen] = useState(false);
    const handleConfirmDeleteClose = () => toggleConfirmDeleteOpen(false);
    const hancleDeleteButton = (attributeId) => {
        setDeleteAttributeId(attributeId)
        toggleConfirmDeleteOpen(true);
    }
    const handleConfirmDeleteButton = () => {
        props.handleDeleteAttributeData(deleteAttributeId);
        setDeleteAttributeId(null);
        handleConfirmDeleteClose();
    }


    const row = !props.attributeData ? [] : Object.keys(props.attributeData).map((index) => {
        const val = props.attributeData[index];
        val["id"] = val["attribute_id"]
        val["prefix_list"] = val["prefix"] ? val["prefix"].join(" / ") : null;
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
                    <Typography variant="body2">削除すると、この属性に関する情報が閲覧できなくなる場合があります。</Typography>
                    <Button variant="contained" onClick={handleConfirmDeleteButton} color="secondary">削除する</Button>
                    <Button variant="contained" onClick={handleConfirmDeleteClose}>キャンセル</Button>
                </div>
            </Modal>
            <Modal
                open={prefixOpen}
                onClose={handleColorPickerClose}
                className={classes.modal}
            >
                <div className={classes.paper}>
                    <PrefixBox
                        prefixList={prefixData.prefix}
                        handleDeletePrefix={handleDeletePrefix}
                        handleRegisterPrefix={handleRegisterPrefix}
                    />
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
                onCellEditStart={handleEditCell}
                onCellEditCommit={handleCommitCell}
                rowsPerPageOptions={[]}
                hideFooterSelectedRowCount
            />
        </div>
    )
}