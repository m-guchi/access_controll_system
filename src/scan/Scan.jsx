import React, { useState, useEffect, useRef, useCallback} from 'react'
import ScanSelect from './ScanSelect'
import ScanBox from './ScanBox'
import ScanList from './ScanList'

import { customAxios } from '../templete/Axios'

export default function Scan (props) {
    const gateDataRef = useRef(null);
    const [gateData, setGateData] = useState(null);
    gateDataRef.current = gateData;
    const [inputState, setInputState] = useState(null);
    const recordPassHistoryRef = useRef(null);
    const [recordPassHistory, toggleRecordPassHistory] = useState(true);
    recordPassHistoryRef.current = recordPassHistory;

    const [attribute, setAttribute] = useState(null);
    const [submitState, setSubmitState] = useState({"error":false,"text":""});

    const [userHistory, setUserHistory] = useState(null)

    //QRコード入力フォームHTMLID
    const yoyakuEl = useRef(null)
    const ticketEl = useRef(null)

    const handleKeyDown = useCallback((e) => {
        if(!gateDataRef.current){return 0;}
        if(e.key==="X"||e.key==="Y"||e.key==="Z"){ //予約QRコード
            keyDownYoyaku();
        }else if(e.key==="T"){ //入場券QRコード
            keyDownTicket();
        }else if(e.key==="Enter"){ //Enter
            keyDownEnter();
        }
    },[]);
    const keyDownYoyaku = () => {
        if(gateDataRef.current.is_yoyaku){
            yoyakuEl.current.value = "";
            yoyakuEl.current.focus();
        }
    }
    const keyDownTicket = () => {
        ticketEl.current.value = "";
        ticketEl.current.focus();
    }
    const keyDownEnter = () => {
        const ticket = ticketEl.current.value;
        const yoyaku = gateDataRef.current.is_yoyaku ? yoyakuEl.current.value : null;
        if(ticket.length==0){
            setInputState("入場券QRコードを入力してください");
        }else if(gateDataRef.current.is_yoyaku && yoyaku.length==0){
            setInputState("予約QRコードを入力してください");
        }else{
            setInputState(false)
            gateDataRef.current.is_yoyaku ? submitGateData(true,ticket,yoyaku) : submitGateData(false,ticket)
            ticketEl.current.value = "";
            if(gateDataRef.current.is_yoyaku){yoyakuEl.current.value = "";}
        }
    }
    const submitGateData = (isYoyaku, ticket=null, yoyaku=null) => {
        const attributeList = {"i":"来場者","g":"団体"};
        if(gateDataRef.current.id){
            const nowDateInst = new Date();
            const nowDate = nowDateInst.toLocaleString();
            if(isYoyaku){ //発券所
                setSubmitState({"error":false,"text":"予約情報送信中"});
                const attribute = "i"; //属性を判別するなにか
                postUserData(yoyaku)
                    .then(res => {
                        postTicketData(nowDate,ticket,yoyaku,attribute)
                        .then(res => {
                            setAttribute(attributeList[res]+"("+yoyaku+")");
                            if(recordPassHistoryRef.current){
                                setSubmitState({"error":false,"text":"通過情報送信中"});
                                updateUserData(yoyaku,ticket,gateDataRef,nowDate);
                            }else{
                                updateDisplayHistoryData(yoyaku)
                                setSubmitState({"error":false,"text":"登録完了"});
                            }
                        }).catch(err => {
                            setAttribute("");
                            if(err === "duplicate_ticket_id"){
                                setSubmitState({"error":true,"text":"この入場券は既に使用されています"});
                            }
                        })
                    }).catch(err => {
                        setAttribute("");
                        if(err === "submit_error"){
                            setSubmitState({"error":true,"text":"送信に失敗しました"});
                        }
                    })
            }else{ //受付
                setSubmitState({"error":false,"text":"通過情報送信中"});
                getTicketData(ticket)
                .then(res => {
                    if(res.length===0){
                        setSubmitState({"error":true,"text":"この入場券は発券所を通過していません"});
                        setAttribute("");
                    }else{
                        const ticketData = res[0]
                        const yoyaku = ticketData.yoyaku_id;
                        setAttribute(attributeList[ticketData.attribute]+"("+yoyaku+")");
                        updateUserData(yoyaku,ticket,gateDataRef,nowDate);
                    }
                })
            }
            console.log(isYoyaku, gateDataRef.current.id, ticket, yoyaku, "Submit!!");
        }else{
            setSubmitState({"error":true,"text":"データ処理に失敗しました"});
            setAttribute("");
        }
    }
    const updateUserData = (yoyaku,ticket,gateDataRef,nowDate) => {
        putUserData(yoyaku,gateDataRef.current.p_in,nowDate)
        .then(res => {
            postGateData(yoyaku,gateDataRef.current.p_in,gateDataRef.current.p_out,nowDate,ticket)
            .then(res => {
                updateDisplayHistoryData(yoyaku)
            })
        })
    }
    const updateDisplayHistoryData = (yoyakuId) => {
        getHistoryGate(yoyakuId)
        .then(res => {
            const GateArrayData = res.map(val => {
                return {
                    "time": val.pass_time,
                    "kind": "gate",
                    "in": val.in_point,
                    "out": val.out_point
                }
            })
            getHistoryYoyaku(yoyakuId)
            .then(res => {
                const YoyakuArrayData = res.map(val => {
                    return {
                        "time": val.time,
                        "kind": "yoyaku",
                        "ticket": val.ticket_id
                    }
                })
                const userList = YoyakuArrayData.concat(GateArrayData).sort((a,b) => {
                    return (a.time < b.time) ? 1 : -1;
                })
                setUserHistory(userList)
                setSubmitState({"error":false,"text":"登録完了"});
            })
        })
    }
    const postTicketData = (nowDate, ticket, yoyaku, attribute) => {
        return new Promise((resolve, reject) => {
            customAxios.post("/tickets/",{
                time: nowDate,
                ticket_id: ticket,
                yoyaku_id: yoyaku,
                attribute: attribute
            })
            .then(res => {
                if(res.status===204){
                    resolve(attribute);
                }else{
                    reject(res.data.error.type);
                }
            })
        })
    }
    const postUserData = (yoyaku) => {
        return new Promise((resolve, reject) => {
            customAxios.post("/user/",{
                yoyaku_id: yoyaku,
            })
            .then(res => {
                if(res.status===204){
                    resolve();
                }else{
                    reject(res.data.error.type);
                }
            })
        })
    }
    const postGateData = (yoyaku,inPoint,outPoint,time=null,ticket=null) => {
        return new Promise((resolve, reject) => {
            customAxios.post("/gates/",{
                yoyaku_id: yoyaku,
                ticket_id: ticket,
                in_point: inPoint,
                out_point: outPoint,
                pass_time: time,
            })
            .then(res => {
                if(res.status===204){
                    resolve();
                }else{
                    reject(res.data.error.type);
                }
            })
        })
    }
    const getTicketData = (ticket) => {
        return new Promise((resolve, reject) => {
            customAxios.get("/tickets/ticket/"+ticket)
            .then(res => {
                if(res.status===200){
                    resolve(res.data);
                }else{
                    reject(res.data.error.type);
                }
            })
        })
    }
    const putUserData = (yoyaku,point,time) => {
        return new Promise((resolve, reject) => {
            customAxios.put("/user/",{
                yoyaku_id: yoyaku,
                last_point: point,
                last_pass_time: time
            })
            .then(res => {
                if(res.status===204){
                    resolve();
                }else{
                    reject(res.data.error.type);
                }
            })
        })
    }
    const getHistoryGate = (yoyaku) => {
        return new Promise((resolve, reject) => {
            customAxios.get("/gates/"+yoyaku)
            .then(res => {
                if(res.status===200){
                    resolve(res.data)
                }
            })
        })
    }
    const getHistoryYoyaku = (yoyaku) => {
        return new Promise((resolve, reject) => {
            customAxios.get("/tickets/yoyaku/"+yoyaku)
            .then(res => {
                if(res.status===200){
                    resolve(res.data)
                }
            })
        })
    }


    const [gateInfo, setGateInfo] = useState(null)
    const [pointInfo, setPointInfo] = useState(null)

    const getInfo = () => {
        customAxios.get("/info/gate")
        .then(res => {
            if(res.status===200){
                setGateInfo(res.data)
            }
        })
        customAxios.get("/info/point")
        .then(res => {
            if(res.status===200){
                setPointInfo(res.data)
            }
        })
    }
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);
        getInfo();
    }, []);

    if(!pointInfo || !gateInfo){return null}
    return(
        <React.Fragment>
            <ScanSelect
                gateData={gateDataRef.current}
                setGateData={setGateData}
                gateInfo={gateInfo}
                pointInfo={pointInfo}
            />
            {gateDataRef.current && <ScanBox
                is_yoyaku={gateDataRef.current.is_yoyaku}
                yoyakuEl={yoyakuEl}
                ticketEl={ticketEl}
                inputState={inputState}
                recordPassHistory={recordPassHistoryRef.current}
                toggleRecordPassHistory={toggleRecordPassHistory}
                attribute={attribute}
                submitState={submitState}
            />}
            <ScanList
                userHistory={userHistory}
                pointInfo={pointInfo}
            />
        </React.Fragment>
    )
}