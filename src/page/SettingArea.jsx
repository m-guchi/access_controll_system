import React, { useState, useContext }  from 'react';
import { Grid ,Typography } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { AlertBarContext } from '../context/AlertBarContext';
import { customAxios } from '../templete/Axios';
import AreaTable from '../grid/settingArea/Table';
import Register from '../grid/settingArea/Register'
import ReloadButton from '../atoms/ReloadButton';
import Forbidden from '../templete/Forbidden';

export default function SettingAreaPage (props) {
    const contextToken = useContext(tokenContext);
    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);

    const [areaData, setAreaData] = useState(contextInfo.data.area)
    const [isFetching, toggleFetching] = useState(false);
    
    const putAreaData = (token, data) => {
        toggleFetching(true);
        customAxios.put("/setting/area/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    contextInfo.set({
                        ...contextInfo.data,
                        area:{
                            ...areaData,
                            [res.data.data.area_id]:res.data.data
                        }
                    })
                    setAreaData({
                        ...areaData,
                        [res.data.data.area_id]:res.data.data
                    })
                    contextAlertBar.setSuccess("エリア情報を登録/変更しました");
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    putAreaData(res.data.token, data);
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
    const handleAreaData = (data) => {
        putAreaData(contextToken.token, data)
    }

    const deleteAreaData = (token, areaId) => {
        toggleFetching(true);
        customAxios.delete("/setting/area/", {
            data: {area_id: areaId},
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.status===204){
                    contextAlertBar.setSuccess("エリア情報を削除しました");
                    getInfoData(token)
                    toggleFetching(false);
                }else{
                    if(res.data.token) contextToken.set(res.data.token);
                    if(res.data.ok){
                        if(res.data.error.type==="need_this_token"){
                            deleteAreaData(res.data.token, areaId);
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
    const handleDeleteAreaData = (areaId) => {
        deleteAreaData(contextToken.token, areaId)
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
                    setAreaData(res.data.data.area)
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
                    <Typography variant="body2" color="secondary">ダブルクリックで更新可能(エリア名/定員/表示)</Typography>
                    <AreaTable
                        areaData={areaData}
                        isFetching={isFetching}
                        handleAreaData={handleAreaData}
                        handleDeleteAreaData={handleDeleteAreaData}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Register
                        handleAreaData={handleAreaData}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}