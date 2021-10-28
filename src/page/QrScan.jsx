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
import { attributeNumberList } from '../data/attribute';

const nextScanTime = 1500;

export default function QrScanPage (props) {
    const tokenData = useContext(tokenContext)
    const userInfo = useContext(userContext);
    const infoData = useContext(infoContext);

    const [isDevice, toggleDevice] = useState(null);
    const [canUseScan, toggleCanUseScan] = useState(true);
    const [qrDataInTicket, setQrDataInTicket] = useState({yoyakuId:null, ticketId:null});
    const [useGateData, setUseGateData] = useState({id:null, ticket:false});
    const [isGateWhenTicket, toggleGateWhenTicket] = useState(true);
    const [postVisitorData, setPostVisitorData] = useState(null);
    const [visitorHistory, setVisitorHistory] = useState(null);
    const [isSending, toggleSending] = useState(false);
    const [errorText, setErrorText] = useState(null);

    const token = tokenData.token;

    const canVisitorsHistory = userInfo.data ? userInfo.data.authority.includes("visitors_history") : false

    useEffect(() => {
        toggleDevice(isMobile ? "sm" : "pc")
    },[])

    const handleScan = (data) => {
        if(data && canUseScan){
            const topString = data.slice(0,1)
            const top6String = data.slice(0,6)
            if(attributeNumberList.includes(top6String)||["X","Y","Z"].includes(topString)){
                toggleCanUseScan(false)
                if(useGateData.ticket){
                    if(!qrDataInTicket.ticketId){
                        setQrDataInTicket({yoyakuId:data, ticketId:""})
                        setTimeout(() => {
                            toggleCanUseScan(true)
                        }, nextScanTime);
                    }else{
                        submitData({ticketId:qrDataInTicket.tickedId, yoyakuId:data})
                        setQrDataInTicket({...qrDataInTicket, yoyakuId:data})
                        setTimeout(() => {
                            setQrDataInTicket({yoyakuId:"", ticketId:""})
                            toggleCanUseScan(true)
                        }, nextScanTime);
                    }
                }else{
                    toggleCanUseScan(true)
                }
            }else if(["T"].includes(topString)){
                toggleCanUseScan(false)
                if(!useGateData.ticket){
                    submitData({ticketId:data, yoyakuId:""})
                    setQrDataInTicket({yoyakuId:"", ticketId:data})
                    setTimeout(() => {
                        toggleCanUseScan(true)
                        setQrDataInTicket({yoyakuId:"", ticketId:""})
                    }, nextScanTime);
                }else{
                    if(!qrDataInTicket.yoyakuId){
                        setQrDataInTicket({yoyakuId:"", ticketId:data})
                        setTimeout(() => {
                            toggleCanUseScan(true)
                        }, nextScanTime);
                    }else{
                        submitData({ticketId:data, yoyakuId:qrDataInTicket.yoyakuId})
                        setQrDataInTicket({...qrDataInTicket, ticketId:data})
                        setTimeout(() => {
                            setQrDataInTicket({yoyakuId:"", ticketId:""})
                            toggleCanUseScan(true)
                        }, nextScanTime);
                    }
                }
            }
        }
    }
    
    const handleGateId = (gateId) => {
        setUseGateData({
            id: gateId,
            ticket: Boolean(infoData.gate[gateId].ticket_flag)
        })
    }

    const submitData = (inputData) => {
        const nowDateInst = new Date();
        const nowDate = nowDateInst.toLocaleString();
        const gateData = {
            ticket_id: inputData.ticketId,
            gate_id: useGateData.id,
            user_id: userInfo.data.user_id,
            pass_time: nowDate,
        }
        const ticketData = {
            ticket_id: inputData.ticketId,
            yoyaku_id: inputData.yoyakuId.replace("+","-"),
        }
        
        toggleSending(true)
        setPostVisitorData(null)
        setErrorText(null)
        setVisitorHistory(null)
        if(useGateData.ticket){
            postTicketData(ticketData, token)
            .then(res => {
                if(isGateWhenTicket){
                    postGateProgress(gateData, token);
                }else{
                    getVisitorHistoryData(ticketData.yoyaku_id, token)
                }
            })
            .catch(res => {
                if(res.status===400 && res.data.error.type==="already_ticket_id"){
                    setErrorText("この入場券QRコードは既に使用されています")
                }else{
                    setErrorText("データ送信時にエラーが発生しました")
                }
            })
            toggleSending(false)
        }else{
            toggleSending(false)
            postGateProgress(gateData, token);
        }
    }

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
                setErrorText("この入場券QRコードは登録されていません")
            }else{
                setErrorText("入場券情報取得時にエラーが発生しました")
            }
            toggleSending(false)
        })
    }

    const getVisiorData = (ticketId, token) => {
        return new Promise((resolve,reject) => {
            customAxios.get("/visitor/ticket/?ticket_id="+ticketId,{
                headers: {"token": token}
            })
            .then(res => {
                if(res.status===200){
                    if(res.data.info && res.data.info.token){
                        getVisiorData(ticketId, res.data.info.token)
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
                    postGataData(gateData, visitorData, gateRes.data.info.token)
                }else if(visitorRes.data.info && visitorRes.data.info.token){
                    postGataData(gateData, visitorData, visitorRes.data.info.token)
                }else{
                    getVisitorHistoryData(visitorData.yoyaku_id, token)
                    toggleSending(false)
                    setErrorText(null)
                }
            }else{
                setErrorText("データ送信時にエラーが発生しました")
                toggleSending(false)
            }
        })
    }

    const postTicketData = (data, token) => {
        return new Promise((resolve,reject) => {
            customAxios({
                method: "post",
                url: "/visitor/ticket",
                data: data,
                headers: {"token": token}
            })
            .then(res => {
                if(res.status===200){
                    if(res.data.info && res.data.info.token){
                        postTicketData(data, res.data.info.token)
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

    const getVisitorHistoryData = (yoyakuId, token) => {
        if(!canVisitorsHistory){
            customAxios.get("/visitor/?yoyaku_id="+yoyakuId,{
                headers: {"token": token}
            })
            .then(res => {
                if(res.status===200){
                    if(res.data.info && res.data.info.token){
                        getVisitorHistoryData(yoyakuId, res.data.info.token)
                    }else{
                        setPostVisitorData(res.data)
                    }
                }else{
                    setErrorText("履歴取得時にエラーが発生しました")
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
                        getVisitorHistoryData(yoyakuId, gateRes.data.info.token)
                    }else if(visitorRes.data.info && visitorRes.data.info.token){
                        getVisitorHistoryData(yoyakuId, visitorRes.data.info.token)
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
                        user={userInfo.data}
                        gateList={infoData.gate}
                        areaList={infoData.area}
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
                        areaList={infoData.area}
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