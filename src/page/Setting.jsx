import React, { useState, useContext }  from 'react';
import { Grid ,Typography } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { AlertBarContext } from '../context/AlertBarContext';
import { customAxios } from '../templete/Axios';
import Table from '../grid/setting/Table';
import ReloadButton from '../atoms/ReloadButton';
import Forbidden from '../templete/Forbidden';

export default function SettingPage (props) {
    const contextToken = useContext(tokenContext);
    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);

    const [settingData, setSettingData] = useState(contextInfo.data.setting)
    const [isFetching, toggleFetching] = useState(false);
    
    const putSettingData = (token, data) => {
        toggleFetching(true);
        customAxios.put("/setting/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    contextInfo.set({
                        ...contextInfo.data,
                        setting:{
                            ...settingData,
                            [res.data.data.id]:{
                                ...settingData[res.data.data.id],
                                value:res.data.data.value
                            }
                        }
                    })
                    setSettingData({
                        ...settingData,
                        [res.data.data.id]:{
                            ...settingData[res.data.data.id],
                            value:res.data.data.value
                        }
                    })
                    contextAlertBar.setSuccess(res.data.data.id+" を "+res.data.data.value+" に変更しました");
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    putSettingData(res.data.token, data);
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
    const handleSettingData = (data) => {
        console.log(data)
        putSettingData(contextToken.token, data)
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
                    setSettingData(res.data.data.setting)
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
                    <Typography variant="body2" color="secondary">設定値はダブルクリックで更新可能</Typography>
                    <Table
                        data={settingData}
                        isFetching={isFetching}
                        handleSettingData={handleSettingData}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}