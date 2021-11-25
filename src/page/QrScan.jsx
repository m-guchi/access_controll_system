import React, { useState, useEffect, useContext, useCallback }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { AlertBarContext } from '../context/AlertBarContext';
import QrScanPlaceSelect from '../grid/qrScan/PlaceSelect'
import RegisterTextField from '../grid/qrScan/RegisterTextField'
import UserHistoryTable from '../grid/qrScan/Table'
import Scan from '../grid/qrScan/Scan'
import SwitchScanMode from '../grid/qrScan/SwitchScanMode'
import Forbidden from '../templete/Forbidden';
import { customAxios } from '../templete/Axios';
import { isMobile } from "react-device-detect";


export default function QrScanPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);

    const [isDeviceSm, toggleDeviceSm] = useState(false);
    const [isSending, toggleSending] = useState(false);

    useEffect(() => {
        toggleDeviceSm(isMobile)
    },[])

    const [selectedGateId, setSelectGateId] = useState(null);
    const handleSelectGateId = (gateId) => {
        resetTextBox();
        setSelectGateId(gateId);
    }

    const [textUserId, setTextUserId] = useState("");
    const [textTicketId, setTextTicketId] = useState("");

    const selectGateData = contextInfo.data.gate[selectedGateId];
    const isUseTicketMode = Boolean(Number(contextInfo.data.setting.use_ticket.value));

    //入力BOXに制御
    const inputTextValue = {
        userId: textUserId,
        ticketId: textTicketId,
    };
    const setTextBox = (isTicketId, text, isEnter) => {
        if(isTicketId){
            setTextTicketId(text)
        }else{
            setTextUserId(text)
        }
        if(isEnter){
            const decideData = isTicketId ? {
                ...inputTextValue, 
                ticketId: text,
            } : {
                ...inputTextValue,
                userId: text,
            }
            handleDecideData(decideData);
        }
    };
    const resetTextBox = () => {
        setTextUserId("");
        setTextTicketId("");
    }

    //カメラで読み込んだ直後の処理
    const handleScan = (data) => {
        if(data===null){
            return;
        }
        toggleSending(true);
        const isTicketPrefix = checkTicketId(data);
        setTextBox(isTicketPrefix,data,true);
    }

    //ticketであるか判定
    const checkTicketId = useCallback((text) => {
        const setting = contextInfo.data.setting;
        const ticketPrefix = setting.ticket_prefix.value ? setting.ticket_prefix.value.split(',') : [];
        return (Boolean(Number(setting.use_ticket.value)) && ticketPrefix.length>0 && ticketPrefix.some((val) => text.indexOf(val)===0))
    },[contextInfo]);
    //属性の判定
    const checkAttribute = useCallback((text) => {
        if(text==="") return null;
        const attributeList = contextInfo.data.attribute;
        let decideAttributeData = {
            id: null,
            length: 0,
        }
        Object.keys(attributeList).forEach(attributeId => {
            const prefixList = attributeList[attributeId].prefix;
            if(prefixList){
                prefixList.forEach(prefix => {
                    if(text.indexOf(prefix)===0){
                        if(decideAttributeData.length < prefix.length){
                            decideAttributeData.id = attributeId;
                            decideAttributeData.length = prefix.length;
                        }
                    }
                })
            } 
        })
        return decideAttributeData.id;
    },[contextInfo]);

    //データを送信する
    const handleDecideData = (data) => {
        const submitDataBody = {
            user_id: data.userId,
            ticket_id: data.ticketId,
            gate_id: selectedGateId,
            attribute_id: checkAttribute(data.userId),
        }
        if(!isUseTicketMode || !Boolean(Number(selectGateData.can_make_ticket))){
            submitData(submitDataBody);
        }else{
            if(data.userId!=="" && data.ticketId!==""){
                submitDataWithTicket(submitDataBody);
            }else{
                toggleSending(false);
            }
        }
    }
    const submitData = (data) => {
        toggleSending(true);
        putUserPass(data, contextToken.token);
    }
    const submitDataWithTicket = (data) => {
        toggleSending(true);
        putTicket(data, contextToken.token);
    }
    const putTicket = (data, token) => {
        customAxios.put("/ticket/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    const successMsg = "チケットID( "+data.ticket_id+" )をユーザーIDに紐付けしました。"
                    putUserPass(data, token, successMsg);
                }else{
                    if(res.data.error.type==="need_this_token"){
                        putTicket(data, res.data.token);
                    }else{
                        contextAlertBar.setOtherError(res.data.error);
                        toggleSending(false);
                    }
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleSending(false);
            }
        })
    }
    const putUserPass = (data, token, successMsg="") => {
        customAxios.put("/user/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    contextAlertBar.setSuccess(successMsg+"ユーザーID( "+res.data.data.user_id+" )の通過情報を登録しました")
                    getUserPass(res.data.data.user_id, token)
                }else{
                    if(res.data.error.type==="need_this_token"){
                        putUserPass(data, res.data.token, successMsg);
                    }else{
                        switch(res.data.error.type){
                            case "not_in_ticket_id":
                                contextAlertBar.setWarning("このチケットID( "+data.ticket_id+" )は登録されていません")
                                break;
                            case "not_in_gate_id":
                                contextAlertBar.setError("この受付( gate_id="+data.gate_id+" )は登録されていません。ページをリロードして再度操作を行ってください。")
                                break;
                            default:
                                contextAlertBar.setOtherError(res.data.error);
                                break;
                            }
                        toggleSending(false);
                        resetTextBox();
                    }
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleSending(false);
            }
        })
    }
    const [userPass, setUserPass] = useState([]);
    const getUserPass = (userId, token) => {
        customAxios.get("/user/pass/?user_id="+userId, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setUserPass(res.data.data.pass);
                    toggleSending(false);
                    resetTextBox();
                }else{
                    if(res.data.error.type==="need_this_token"){
                        getUserPass(userId, res.data.token);
                    }else{
                        contextAlertBar.setOtherError(res.data.error);
                        toggleSending(false);
                        resetTextBox();
                    }
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleSending(false);
            }
        })
    }

    const onClickEnter = () => {
        handleDecideData(inputTextValue);
    }

    return(
        <Forbidden authority="record_user_pass">
            <Grid container>
                <Grid item lg={4} sm={6} xs={12}>
                    <QrScanPlaceSelect
                        selectedGateId={selectedGateId}
                        setSelectGateId={handleSelectGateId}
                    />
                    { (isDeviceSm && selectedGateId) &&
                        <Scan
                            handleScan={handleScan}
                            isAbleScan={!isSending}
                        />
                    }
                    {selectedGateId &&
                        <RegisterTextField
                            selectedGateId={selectedGateId}
                            inputTextValue={inputTextValue}
                            isSending={isSending}
                            isDeviceSm={isDeviceSm}
                            setTextBox={setTextBox}
                            checkTicketId={checkTicketId}
                            onClickEnter={onClickEnter}
                        />
                    }
                </Grid>
                <Grid item lg={8} sm={6} xs={12}>
                    <UserHistoryTable
                        userPass={userPass}
                    />
                </Grid>
                <Grid item lg={4} sm={6} xs={12}>
                    <SwitchScanMode
                        isDeviceSm={isDeviceSm}
                        toggleDeviceSm={toggleDeviceSm}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}