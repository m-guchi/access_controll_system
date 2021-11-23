import React, { useState, useContext }  from 'react';
import { Grid, Typography } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { AlertBarContext } from '../context/AlertBarContext';
import { customAxios } from '../templete/Axios';
import Table from '../grid/settingGate/Table';
import Register from '../grid/settingGate/Register'
import ReloadButton from '../atoms/ReloadButton';
import Forbidden from '../templete/Forbidden';

export default function SettingGatePage (props) {
    const contextToken = useContext(tokenContext);
    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);

    const [gateData, setGateData] = useState(contextInfo.data.gate)
    const [isFetching, toggleFetching] = useState(false);

    const putGateData = (token, data) => {
        toggleFetching(true);
        customAxios.put("/setting/gate/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    contextInfo.set({
                        ...contextInfo.data,
                        gate:{
                            ...gateData,
                            [res.data.data.gate_id]:res.data.data
                        }
                    })
                    setGateData({
                        ...gateData,
                        [res.data.data.gate_id]:res.data.data
                    })
                    contextAlertBar.setSuccess("受付情報を登録/変更しました");
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    putGateData(res.data.token, data);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                    toggleFetching(false);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleFetching(false);
            }
        })
    }
    const handleGateData = (data) => {
        putGateData(contextToken.token, data)
    }

    const deleteGateData = (token, gateId) => {
        toggleFetching(true);
        customAxios.delete("/setting/gate/", {
            data: {gate_id: gateId},
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.status===204){
                    contextAlertBar.setSuccess("受付情報を削除しました");
                    getInfoData(token)
                    toggleFetching(false);
                }else{
                    if(res.data.token) contextToken.set(res.data.token);
                    if(res.data.ok){
                        if(res.data.error.type==="need_this_token"){
                            deleteGateData(res.data.token, gateId);
                        }else{
                            toggleFetching(false);
                        }
                    }else{
                        contextAlertBar.setOtherError(res.data.error);
                        toggleFetching(false);
                    }
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleFetching(false);
            }
        })
    }
    const handleDeleteGateData = (gateId) => {
        deleteGateData(contextToken.token, gateId)
    }

    const getInfoData = (token) => {
        toggleFetching(true);
        customAxios.get("/setting/",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setGateData(res.data.data.gate)
                    contextInfo.set(res.data.data);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getInfoData(res.data.token);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                    toggleFetching(false);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleFetching(false);
            }
        })
    }
    const fetchInfoData = () => {
        getInfoData(contextToken.token)
    }

    return(
        <Forbidden authority="setting_mgmt">
            <Grid container>
                <Grid item xs={12}>
                    <ReloadButton onClick={fetchInfoData}/>
                    <Typography variant="body2" color="secondary">ダブルクリックで更新可能(受付名/前エリアID/次エリアID/紐付け)</Typography>
                    <Table
                        gateData={gateData}
                        isFetching={isFetching}
                        handleGateData={handleGateData}
                        handleDeleteGateData={handleDeleteGateData}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Register
                        handleGateData={handleGateData}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}