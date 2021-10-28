import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button, Typography } from '@material-ui/core';
import { customAxios } from '../../templete/Axios';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';

const useStyles = makeStyles((theme) => ({
    buttonBox: {
        "& > *": {
            margin: theme.spacing(0.5)
        }
    }
}));


export default function UpdateAreaInfo (props) {
    const classes = useStyles();

    const [updateText, setUpdateText] = useState(null);

    const handleInputAreaId = (e) => props.setInputData({...props.inputData, areaId: e.target.value })
    const handleInputAreaName = (e) => props.setInputData({...props.inputData, areaName: e.target.value })

    const handleUpdate = () => {
        if(!props.inputData.areaId){
            setUpdateText("エリアIDを入力してください")
            return 0;
        }

        if(!props.inputData.areaName){
            setUpdateText("エリア名を入力してください")
        }else{
            putAreaInfo({
                area_id:props.inputData.areaId,
                area_name:props.inputData.areaName
            }, props.token)
        }
    }

    const handleDelete = () => deleteAreaInfo(props.inputData.areaId, props.token)

    const axiosAreaInfo = (method, data, token) => {
        return customAxios({
            method: method,
            url: "/area/info",
            data: data,
            headers: {"token": token}
        })
    }

    const putAreaInfo = (data, token) => {
        axiosAreaInfo("put", data, token)
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    putAreaInfo(data, res.data.info.token)
                }else{
                    getInfoData();
                    setUpdateText("登録しました");
                    props.setInputData({
                        areaId: null,
                        areaName: null,
                        isExist: false,
                    })
                }
            }else{
                setUpdateText("登録に失敗しました");
            }
        })
    }

    const deleteAreaInfo = (areaId, token) => {
        axiosAreaInfo("delete", {area_id: areaId}, token)
        .then(res => {
            if(res.status===200 && res.data.info && res.data.info.token){
                deleteAreaInfo(areaId, res.data.info.token)
            }else if(res.status===204){
                getInfoData();
                setUpdateText("削除しました");
                props.setInputData({
                    areaId: null,
                    areaName: null,
                    isExist: false,
                })
            }else{
                setUpdateText("削除に失敗しました");
            }
        })
    }

    const getInfoData = () => {
        Promise.all([
            customAxios.get("/gate/info",{
                headers: {"token": props.token}
            }),
            customAxios.get("/area/info",{
                headers: {"token": props.token}
            }),
            customAxios.get("/user/authority",{
                headers: {"token": props.token}
            }),
        ])
        .then(([gateRes, areaRes, authRes]) => {
            if(gateRes.status===200 && areaRes.status===200 && authRes.status===200){
                props.infoData.set({
                    gate:gateRes.data,
                    area:areaRes.data,
                    authority:authRes.data,
                });
            }
        })
    }


    return(
        <PaperWrap>
            <Typography variant='h6'>エリア詳細</Typography>
            <FormBox>
                <div>
                    <TextField
                        value={props.inputData.areaId ?? ""}
                        label="エリアID"
                        variant="outlined"
                        size="small"
                        onChange={handleInputAreaId}
                        InputLabelProps={{shrink: true}}
                        disabled={props.inputData.isExist}
                    />
                </div>
                <div>
                    <TextField
                        value={props.inputData.areaName ?? ""}
                        label="エリア名"
                        variant="outlined"
                        size="small"
                        onChange={handleInputAreaName}
                        InputLabelProps={{shrink: true}}
                    />
                </div>
                <div>
                    <Typography color="error" variant="body2">{updateText}</Typography>
                </div>
                <div className={classes.buttonBox}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                    >{props.inputData.isExist ? "更新" : "登録"}</Button>
                    {props.inputData.isExist &&
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleDelete}
                        >削除</Button>
                    }
                </div>
            </FormBox>
        </PaperWrap>
    )
}