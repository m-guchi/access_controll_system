import React, { useState, useEffect, useRef } from 'react'
import { TextField, Button, IconButton } from '@material-ui/core';
import useKeypress from 'react-use-keypress';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';
import SendIcon from '@material-ui/icons/Send';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { attributeNumberList, attributeList } from '../../data/attribute';


export default function QrScanRegister (props) {

    const yoyakuElement = useRef(null);
    const ticketElement = useRef(null);

    const [isInputError, setInputError] = useState({ticket:false, yoyaku:false});

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const topStringArray = [];
    const handleKeyDown = useKeypress(["0","1","2","3","4","5","6","7","8","9","-","T","Enter","Escape"," "], (e) => {
        if(!props.useGateData || !props.useGateData.id) return null
        if(topStringArray.length<6){
            topStringArray.push(e.key);
            if(["0","1","5","8"].includes(e.key)){
                if(topStringArray.length===6){
                    const topString = topStringArray.join("");
                    if(attributeNumberList.includes(topString)){
                        keyDownYoyaku(topString.substr(0,5));
                    }
                }
            }
        }
        if(e.key==="T"){ //入場券QRコード
            keyDownTicket();
        }else if(e.key==="Enter"){ //Enter
            keyDownEnter();
            topStringArray.splice(0) //配列クリア
        }else if(e.key==="Escape"||e.key===" "){ //Escape or Space
            topStringArray.splice(0) //配列クリア
        }
    },[]);

    const keyDownYoyaku = (topString) => {
        yoyakuElement.current.value = topString;
        yoyakuElement.current.focus();
    }
    const keyDownTicket = () => {
        ticketElement.current.value = "";
        ticketElement.current.focus();
    }
    const keyDownEnter = () => {
        const ticket = ticketElement.current.value;
        const yoyaku = yoyakuElement.current.value;
        if(ticket.length===0){
            props.setErrorText("入場券QRコードを入力してください");
            setInputError({ticket:true, yoyaku:false});
        }else if(yoyaku.length===0 && Boolean(props.useGateData.ticket)){
            props.setErrorText("予約QRコードを入力してください");
            setInputError({ticket:false, yoyaku:true});
        }else{
            props.setErrorText(null);
            setInputError({ticket:false, yoyaku:false});
            props.submitData({yoyakuId: yoyaku, ticketId: ticket});
            yoyakuElement.current.value = "";
            ticketElement.current.value = "";
        }
    }

    const [isRandomYoyaku, toggleRandomYoyaku] = useState(false);

    const randomYoyakuId = (attribute) => {
        const nowDateInst = new Date();
        const unixNowDate = String(nowDateInst.getTime());
        yoyakuElement.current.value = attribute+(unixNowDate.substr(-9));
        toggleRandomYoyaku(false);
    }

    if(!props.useGateData || !props.useGateData.id) return null
    return(
        <PaperWrap>
            <FormBox>
                <div hidden={!Boolean(props.useGateData.ticket)}>
                    <TextField
                        inputRef={yoyakuElement}
                        label="予約QRコード"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: 13 }}
                        disabled={props.isSending || props.isSm}
                        error={isInputError.yoyaku}
                        value={props.qrDataInTicket.yoyakuId}
                    />
                    {!props.isSm &&
                        <IconButton color={!isRandomYoyaku?"primary":""} component="span" onClick={()=>toggleRandomYoyaku(!isRandomYoyaku)}>
                            <AssignmentIcon />
                        </IconButton>
                    }
                    <div hidden={!isRandomYoyaku}>
                        {
                            Object.keys(attributeList).map((index) => (
                                <Button variant="outlined" color="primary" onClick={()=>randomYoyakuId(index)}>
                                    {attributeList[index]}
                                </Button>
                            ))
                        }
                        
                    </div>
                </div>
                <div>
                    <TextField
                        inputRef={ticketElement}
                        label="入場券QRコード"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: 12 }}
                        disabled={props.isSending || props.isSm}
                        error={isInputError.ticket}
                        value={props.qrDataInTicket.ticketId}
                    />
                </div>
                {!props.isSm &&
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon/>}
                            onClick={keyDownEnter}
                            disabled={props.isSending}
                        >送信</Button>
                    </div>
                }
            </FormBox>
        </PaperWrap>
    )
}