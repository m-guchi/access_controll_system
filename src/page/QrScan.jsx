import React, { useState, useEffect, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { userContext } from '../context/user';
import { infoContext } from '../context/info';
import QrScanPlaceSelect from '../grid/qrScan/PlaceSelect'
import QrScanRegister from '../grid/qrScan/Register'
import VisitorHistoryTable from '../grid/qrScan/Table'
import VisitorDetail from '../grid/qrScan/Detail'
import Scan from '../grid/qrScan/Scan'
import SwitchScanMode from '../grid/qrScan/SwitchScanMode'
import Forbidden from '../templete/Forbidden';
import { customAxios } from '../templete/Axios';
import { isMobile } from "react-device-detect";


export default function QrScanPage (props) {
    const useToken = useContext(tokenContext)
    const useUser = useContext(userContext);
    const useInfo = useContext(infoContext);

    const [isDevice, toggleDevice] = useState(null);
    const [canUseScan, toggleCanUseScan] = useState(true);
    const [qrDataInTicket, setQrDataInTicket] = useState({yoyakuId:"", ticketId:""});
    const [useGateData, setUseGateData] = useState({id:null, ticket:false});
    const [isGateWhenTicket, toggleGateWhenTicket] = useState(true);
    const [postVisitorData, setPostVisitorData] = useState(null);
    const [visitorHistory, setVisitorHistory] = useState(null);
    const [isSending, toggleSending] = useState(false);
    const [errorText, setErrorText] = useState(null);
    
    const token = useToken.token;
    const nextScanTime = useInfo.setting.qrcode_nextscan_wait_time_in_sm * 1000;
    const canVisitorsHistory = useUser.data ? useUser.data.authority.includes("visitors_history") : false

    const resetQrDataInTicket = () => {
        setQrDataInTicket({yoyakuId:"", ticketId:""});
    }

    useEffect(() => {
        toggleDevice(isMobile ? "sm" : "pc")
    },[])

    //prefixの一覧配列
    let prefixArr = [];
    Object.keys(useInfo.attribute).forEach((index) => {
        const val = useInfo.attribute[index];
        prefixArr = prefixArr.concat(val.prefix);
    })
    prefixArr.sort();

    const ticketPrefixArr = useInfo.setting.ticket_prefix.split(',');

    //スマホで読み込んだ直後の処理
    const handleScan = (data) => {
        if(data && canUseScan){
            const isYoyakuMatch = prefixArr.some((val) => data.indexOf(val)===0);
            const isTicketMatch = ticketPrefixArr.some((val) => data.indexOf(val)===0)
            if(useGateData.ticket && isYoyakuMatch){ //予約IDが入力された
                toggleCanUseScan(false)
                if(qrDataInTicket.ticketId){ //入場券ID入力されていない
                    setQrDataInTicket({yoyakuId:data, ticketId:""})
                    setTimeout(() => {
                        toggleCanUseScan(true)
                    }, nextScanTime);
                }else{ //入場券ID入力されている→登録
                    const submitData = {...qrDataInTicket, yoyakuId:data};
                    submitData(submitData);
                    setQrDataInTicket(submitData);
                    setTimeout(() => {
                        resetQrDataInTicket();
                        toggleCanUseScan(true);
                    }, nextScanTime);
                }
            }else if(isTicketMatch){ //入場券IDが入力された
                toggleCanUseScan(false)
                if(!useGateData.ticket){ //発券所ではない(入場券IDのみ)
                    const submitData = {yoyakuId:"", ticketId:data};
                    submitData(submitData)
                    setQrDataInTicket(submitData)
                    setTimeout(() => {
                        resetQrDataInTicket();
                        toggleCanUseScan(true);
                    }, nextScanTime);
                }else{
                    if(!qrDataInTicket.yoyakuId){ //予約ID入力されていない
                        setQrDataInTicket({yoyakuId:"", ticketId:data})
                        setTimeout(() => {
                            toggleCanUseScan(true)
                        }, nextScanTime);
                    }else{ //予約ID入力されている→登録
                        const submitData = {...qrDataInTicket, ticketId:data};
                        submitData(submitData)
                        setQrDataInTicket(submitData)
                        setTimeout(() => {
                            resetQrDataInTicket();
                            toggleCanUseScan(true);
                        }, nextScanTime);
                    }
                }
            }
        }
    }
    
    //受付情報更新
    const handleGateId = (gateId) => {
        setUseGateData({
            id: gateId,
            ticket: Boolean(useInfo.gate[gateId].ticket_flag)
        })
    }

    //データ登録
    const submitData = (inputData) => {
        const nowDateInst = new Date();
        const nowDate = nowDateInst.toLocaleString();
        const gateData = {
            ticket_id: inputData.ticketId,
            gate_id: useGateData.id,
            user_id: useUser.data.user_id,
            pass_time: nowDate,
        }
        const ticketData = {
            ticket_id: inputData.ticketId,
            yoyaku_id: inputData.yoyakuId,
        }
        
        toggleSending(true)
        setPostVisitorData(null)
        setErrorText(null)
        setVisitorHistory(null)
        if(useGateData.ticket){
            postTicketProgress(ticketData, gateData, token);
            toggleSending(false)
        }else{
            postGateProgress(gateData, token);
            toggleSending(false)
        }
    }

    //発券所におけるデータ送信
    const postTicketProgress = (ticketData, gateData, token) => {
        postTicketData(ticketData, token)
        .then(res => {
            if(isGateWhenTicket){ //通過情報も登録
                postGateProgress(gateData, token); //受付と同じ処理
            }else{
                getVisitorHistoryData(ticketData.yoyaku_id, token);
            }
        })
        .catch(res => {
            if(res.status===400 && res.data.error.type==="already_ticket_id"){
                setErrorText("この入場券は既に使用されています。別の入場券を使用してください。")
            }else{
                setErrorText("入場券データ送信時にエラーが発生しました。解決しない場合は一度ログアウトして再度ログインしてください。[ERR=QR156]")
            }
            toggleSending(false)
        })
    }

    //発券情報を登録
    const postTicketData = (data, token) => {
        return new Promise((resolve,reject) => {
            customAxios({
                method: "post",
                url: "/visitor/ticket/",
                data: data,
                headers: {"token": token}
            })
            .then(res => {
                if(res.status===200){
                    if(res.data.info && res.data.info.token){
                        const token = res.data.info.token;
                        useToken.set(token)
                        postTicketData(data, token)
                        .then(res => resolve(res))
                        .catch(res => reject(res))
                    }else{
                        resolve(res);
                    }
                }else{
                    reject(res)
                }
            })
        })
    }

    //受付におけるデータ送信
    const postGateProgress = (gateData, token) => {
        getVisiorData(gateData.ticket_id, token)
        .then(yoyakuId => {
            const visitorData = {
                yoyaku_id: yoyakuId,
                gate_id: gateData.gate_id,
                time: gateData.pass_time,
            }
            postGataData(gateData, visitorData, token);
        })
        .catch(res => {
            if(res.status===400 && res.data.error.type==="not_in_ticket_id"){
                setErrorText("この入場券は登録されていません。")
            }else{
                setErrorText("来場者データ取得時にエラーが発生しました。解決しない場合は一度ログアウトして再度ログインしてください。[ERR=QR201]")
            }
            toggleSending(false)
        })
    }

    //来場者情報を取得
    const getVisiorData = (ticketId, token) => {
        return new Promise((resolve,reject) => {
            customAxios.get("/visitor/ticket/?ticket_id="+ticketId,{
                headers: {"token": token}
            })
            .then(res => {
                if(res.status===200){
                    if(res.data.info && res.data.info.token){
                        const token = res.data.info.token;
                        useToken.set(token)
                        getVisiorData(ticketId, token)
                        .then(res => resolve(res))
                        .catch(res => reject(res))
                    }else{
                        resolve(res.data.yoyaku_id);
                    }
                }else{
                    reject(res)
                }
            })
        })
    }

    //通過情報を登録
    const postGataData = (gateData, visitorData, token) => {
        Promise.all([
            customAxios({
                method: "post",
                url: "/gate/",
                data: gateData,
                headers: {"token": token}
            }),
            customAxios({
                method: "put",
                url: "/visitor/",
                data: visitorData,
                headers: {"token": token}
            })
        ])
        .then(([gateRes, visitorRes]) => {
            if(gateRes.status===200 && visitorRes.status===200){
                if(gateRes.data.info && gateRes.data.info.token){
                    const token = gateRes.data.info.token;
                    useToken.set(token)
                    postGataData(gateData, visitorData, token)
                }else if(visitorRes.data.info && visitorRes.data.info.token){
                    const token = visitorRes.data.info.token;
                    useToken.set(token)
                    postGataData(gateData, visitorData, token)
                }else{
                    getVisitorHistoryData(visitorData.yoyaku_id, token)
                    toggleSending(false)
                    setErrorText(null)
                }
            }else{
                setErrorText("通過データ送信時にエラーが発生しました。解決しない場合は一度ログアウトして再度ログインしてください。[ERR=QR256]")
                toggleSending(false)
            }
        })
    }

    //来場者の通過履歴取得
    const getVisitorHistoryData = (yoyakuId, token) => {
        if(!canVisitorsHistory){ //ログインユーザーが履歴閲覧可能か
            customAxios.get("/visitor/?yoyaku_id="+yoyakuId,{
                headers: {"token": token}
            })
            .then(res => {
                if(res.status===200){
                    if(res.data.info && res.data.info.token){
                        const token = res.data.info.token;
                        useToken.set(token)
                        getVisitorHistoryData(yoyakuId, token)
                    }else{
                        setPostVisitorData(res.data)
                    }
                }else{
                    setErrorText("履歴取得時にエラーが発生しました。")
                    setVisitorHistory(null);
                }
            })
        }else{
            Promise.all([
                customAxios.get("/gate/?yoyaku_id="+yoyakuId,{
                    headers: {"token": token}
                }),
                customAxios.get("/visitor/?yoyaku_id="+yoyakuId,{
                    headers: {"token": token}
                })
            ])
            .then(([gateRes, visitorRes]) => {
                if(gateRes.status===200 && visitorRes.status===200){
                    if(gateRes.data.info && gateRes.data.info.token){
                        const token = gateRes.data.info.token;
                        useToken.set(token)
                        getVisitorHistoryData(yoyakuId, token)
                    }else if(visitorRes.data.info && visitorRes.data.info.token){
                        const token = visitorRes.data.info.token;
                        useToken.set(token)
                        getVisitorHistoryData(yoyakuId, token)
                    }else{
                        setVisitorHistory(gateRes.data);
                        setPostVisitorData(visitorRes.data)
                    }
                }else{
                    setErrorText("履歴取得時にエラーが発生しました")
                    setVisitorHistory(null);
                }
            })
        }
    }

    if(!isDevice) return null
    return(
        <Forbidden authority="qr_scan">
            <Grid container>
                <Grid item lg={4} sm={6} xs={12}>
                    <QrScanPlaceSelect
                        user={useUser.data}
                        gateList={useInfo.gate}
                        areaList={useInfo.area}
                        useGateData={useGateData}
                        setGateId={handleGateId}
                        isGateWhenTicket={isGateWhenTicket}
                        toggleGateWhenTicket={toggleGateWhenTicket}
                    />
                    { (isDevice==="sm" && useGateData.id) &&
                        <Scan
                            handleScan={handleScan}
                            canUseScan={canUseScan}
                        />
                    }
                    <QrScanRegister
                        submitData={submitData}
                        useGateData={useGateData}
                        isSending={isSending}
                        errorText={errorText}
                        setErrorText={setErrorText}
                        qrDataInTicket={qrDataInTicket}
                        prefixArr={prefixArr}
                        isSm={Boolean(isDevice==="sm")}
                    />
                    <VisitorDetail
                        errorText={errorText}
                        postVisitorData={postVisitorData}
                        canVisitorsHistory={canVisitorsHistory}
                    />
                </Grid>
                {canVisitorsHistory &&
                <Grid item lg={8} sm={6} xs={12}>
                    <VisitorHistoryTable
                        visitorHistory={visitorHistory}
                        areaList={useInfo.area}
                    />
                </Grid>
                }
                <Grid item lg={4} sm={6} xs={12}>
                    <SwitchScanMode
                        isDevice={isDevice}
                        toggleDevice={toggleDevice}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}