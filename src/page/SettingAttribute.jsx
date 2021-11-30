import React, { useState, useContext }  from 'react';
import { Grid, Typography } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { AlertBarContext } from '../context/AlertBarContext';
import { customAxios } from '../templete/Axios';
import Table from '../grid/settingAttribute/Table';
import Register from '../grid/settingAttribute/Register'
import ReloadButton from '../atoms/ReloadButton';
import Forbidden from '../templete/Forbidden';

export default function SettingAttributePage (props) {
    const contextToken = useContext(tokenContext);
    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);

    const [attributeData, setAttributeData] = useState(contextInfo.data.attribute)
    const [isFetching, toggleFetching] = useState(false);

    const putAttributeData = (token, data) => {
        toggleFetching(true);
        customAxios.put("/user/attribute/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    getInfoData(token)
                    contextAlertBar.setSuccess("属性情報を登録/変更しました");
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    putAttributeData(res.data.token, data);
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
    const handleAttributeData = (data) => {
        putAttributeData(contextToken.token, data)
    }

    const deleteAttributeData = (token, attributeId) => {
        toggleFetching(true);
        customAxios.delete("/user/attribute/", {
            data: {attribute_id: attributeId},
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.status===204){
                    contextAlertBar.setSuccess("属性情報を削除しました");
                    getInfoData(token)
                    toggleFetching(false);
                }else{
                    if(res.data.token) contextToken.set(res.data.token);
                    if(res.data.ok){
                        if(res.data.error.type==="need_this_token"){
                            deleteAttributeData(res.data.token, attributeId);
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
    const handleDeleteAttributeData = (attributeId) => {
        deleteAttributeData(contextToken.token, attributeId)
    }

    const deletePrefixData = (token, data) => {
        toggleFetching(true);
        customAxios.delete("/user/attribute/prefix/", {
            data: data,
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.status===204){
                    getInfoData(token)
                    contextAlertBar.setSuccess("プレフィックスを削除しました");
                    getInfoData(token)
                    toggleFetching(false);
                }else{
                    if(res.data.token) contextToken.set(res.data.token);
                    if(res.data.ok){
                        if(res.data.error.type==="need_this_token"){
                            deletePrefixData(res.data.token, data);
                            toggleFetching(false);
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
    const handleDeletePrefixData = (attributeId, prefix) => {
        deletePrefixData(contextToken.token, {
            attribute_id: attributeId,
            prefix: prefix
        });
    }

    const postPrefixData = (token, data) => {
        toggleFetching(true);
        customAxios.post("/user/attribute/prefix/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    getInfoData(token)
                    contextAlertBar.setSuccess("プレフィックスを登録しました");
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    postPrefixData(res.data.token, data);
                }else if(res.data.error.type==="already_attribute_id_and_prefix"){
                    contextAlertBar.setWarning("このプレフィックス( "+data.prefix+" )はすでに存在します")
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
    const handleRegisterPrefixData = (attributeId, prefix) => {
        postPrefixData(contextToken.token, {
            attribute_id: attributeId,
            prefix: prefix
        })
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
                    setAttributeData(res.data.data.attribute)
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
                    <Typography variant="body2" color="secondary">ダブルクリックで更新可能(属性名/プレフィックス)</Typography>
                    <Table
                        attributeData={attributeData}
                        isFetching={isFetching}
                        handleAttributeData={handleAttributeData}
                        handleDeleteAttributeData={handleDeleteAttributeData}
                        handleDeletePrefixData={handleDeletePrefixData}
                        handleRegisterPrefixData={handleRegisterPrefixData}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Register
                        handleAttributeData={handleAttributeData}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}