import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button, FormControlLabel, Checkbox, Typography, Select, MenuItem  } from '@material-ui/core';
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

export default function UpdateGateInfo (props) {
    const classes = useStyles();

    const [updateText, setUpdateText] = useState(null);

    const areaList = props.infoData ? props.infoData.area : null;

    const handleInputGateId = (e) => props.setInputData({...props.inputData, "gateId": e.target.value})
    const handleInputGateName = (e) => props.setInputData({...props.inputData, "gateName": e.target.value})
    const handleOutArea = (e) => props.setInputData({...props.inputData, "outArea": e.target.value})
    const handleInArea = (e) => props.setInputData({...props.inputData, "inArea": e.target.value})
    const handleIsTicket = () => props.setInputData({...props.inputData, isTicket: !props.inputData.isTicket})

    const handleUpdate = () => {
        if(!props.inputData.gateId){
            setUpdateText("受付IDを入力してください")
            return 0;
        }

        if(!props.inputData.gateName){
            setUpdateText("受付名を入力してください")
        }else{
            putGateInfo({
                gate_id: props.inputData.gateId,
                gate_name: props.inputData.gateName,
                out_area: props.inputData.outArea,
                in_area: props.inputData.inArea,
                ticket_flag: props.inputData.isTicket,
            }, props.token)
        }
    }

    const handleDelete = () => deleteGateInfo(props.inputData.gateId, props.token)

    const axiosGateInfo = (method, data, token) => {
        return customAxios({
            method: method,
            url: "/gate/info",
            data: data,
            headers: {"token": token}
        })
    }

    const putGateInfo = (data, token) => {
        axiosGateInfo("put", data, token)
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    putGateInfo(data, res.data.info.token)
                }else{
                    getInfoData();
                    setUpdateText("登録しました");
                    props.setInputData({
                        gateId: null,
                        gateName: null,
                        outArea: "P000",
                        inArea: "P000",
                        isTicket: false,
                        isExist: false,
                    })
                }
            }else{
                setUpdateText("登録に失敗しました");
            }
        })
    }

    const deleteGateInfo = (gateId, token) => {
        axiosGateInfo("delete", {gate_id: gateId}, token)
        .then(res => {
            if(res.status===200 && res.data.info && res.data.info.token){
                deleteGateInfo(gateId, res.data.info.token)
            }else if(res.status===204){
                getInfoData();
                setUpdateText("削除しました");
                props.setInputData({
                    gateId: null,
                    gateName: null,
                    outArea: "P000",
                    inArea: "P000",
                    isTicket: false,
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

    const handleDetailReset = () => {
        props.setInputData({
            gateId: null,
            gateName: null,
            outArea: "P000",
            inArea: "P000",
            isTicket: false,
            isExist: false,
        })
    }


    if(!areaList) return null;
    return(
        <PaperWrap>
            <Typography variant='h6'>受付情報編集</Typography>
            <FormBox>
                <div>
                    <TextField
                        value={props.inputData.gateId ?? ""}
                        label="受付ID"
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: 4 }}
                        onChange={handleInputGateId}
                        InputLabelProps={{shrink: true}}
                        disabled={props.inputData.isExist}
                    />
                </div>
                <div>
                    <TextField
                        value={props.inputData.gateName ?? ""}
                        label="受付名"
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: 60 }}
                        onChange={handleInputGateName}
                        InputLabelProps={{shrink: true}}
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={<Checkbox
                            checked={props.inputData.isTicket}
                            onChange={handleIsTicket}
                            color="primary"
                        />}
                        label="発券所"
                    />
                </div>
                <div>
                    <Select value={props.inputData.outArea} onChange={handleOutArea}>
                        {Object.keys(areaList).map((index) => {
                            return <MenuItem  value={index}>{areaList[index].area_name}</MenuItem >
                        })}
                    </Select>
                </div>
                ↓
                <div>
                    <Select value={props.inputData.inArea} onChange={handleInArea}>
                        {Object.keys(areaList).map((index) => {
                            return <MenuItem  value={index}>{areaList[index].area_name}</MenuItem >
                        })}
                    </Select>
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
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDelete}
                            >削除</Button>
                            <Button variant="outlined" onClick={handleDetailReset}>新規登録画面へ</Button>
                        </>
                    }
                </div>
            </FormBox>
        </PaperWrap>
    )
}