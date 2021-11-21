import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { infoContext } from '../../context/info';
import { TextField, Button, Typography } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
    buttonBox: {
        "& > *": {
            margin: theme.spacing(0.5)
        }
    }
}));

export default function RegisterTextField (props) {
    const classes = useStyles();

    const useInfo = useContext(infoContext);

    const yoyakuElement = useRef(null);
    const ticketElement = useRef(null);

    const [isInputError, setInputError] = useState({ticket:false, yoyaku:false});
    const [errorMsg, setErrorMsg] = useState(false);
    const resetInputError = () => {
        setInputError({ticket:false, yoyaku:false})
    }

    const prefixArr = props.prefixArr;
    let prefixStringArrDup = [];
    prefixArr.forEach((val) => {
        prefixStringArrDup = prefixStringArrDup.concat(val.split(""));
    })
    const prefixStringArr = Array.from(new Set(prefixStringArrDup)).sort();
    const ticketPrefixArr = useInfo.setting.ticket_prefix.split(',');
    let ticketPrefixStringArrDup = [];
    ticketPrefixArr.forEach((val) => {
        ticketPrefixStringArrDup = ticketPrefixStringArrDup.concat(val.split(""));
    })
    const ticketPrefixStringArr = Array.from(new Set(ticketPrefixStringArrDup)).sort();
    const inputTextArray = [];

    const handleKeyDown = useCallback((e) => {
        if(!props.selectedGateId) return;
        const key = e.key;
        if(["Process"].includes(key)){
            setErrorMsg("全角文字は使用できません");
        }else{
            setErrorMsg(null);
        }
        if(["Escape"," "].includes(key)){
            inputTextArray.length = 0;
            removeFocus();
        }else if(key==="Enter"){ //Enter
            inputTextArray.length = 0;
            keyDownEnter();
            removeFocus();
        }else if(["Backspace","Delete","Shift","Tab","Process","Zenkaku"].includes(key)){
        }else{
            inputTextArray.push(key);
            if(prefixStringArr.includes(key)){ //予約ID
                const inputTextString = inputTextArray.join("");
                const isYoyakuMatch = prefixArr.some((val) => inputTextString===val)
                if(isYoyakuMatch){
                    keyDownYoyaku(inputTextString);
                }
            }
            if(ticketPrefixStringArr.includes(key)){ //入場券QRコード
                const inputTextString = inputTextArray.join("");
                const isTicketMatch = ticketPrefixArr.some((val) => inputTextString===val)
                if(isTicketMatch){
                    keyDownTicket(inputTextString);
                }
            }
        }
    },[props.selectedGateId]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.selectedGateId, handleKeyDown]);

    const removeFocus = () => {
        yoyakuElement.current.blur();
        ticketElement.current.blur();
    }

    const keyDownYoyaku = (string) => {
        yoyakuElement.current.value = string.slice(0,-1);
        yoyakuElement.current.focus();
    }
    const keyDownTicket = (string) => {
        ticketElement.current.value = string.slice(0,-1);
        ticketElement.current.focus();
    }
    const keyDownEnter = () => {
        console.log(props.selectedGateId)
        const ticket = ticketElement.current.value;
        const yoyaku = yoyakuElement.current.value;
        if(ticket.length===0 || (yoyaku.length===0 && Boolean(props.useGateData.ticket))){
            return false;
        }else{
            props.setErrorText(null);
            setInputError({ticket:false, yoyaku:false});
            props.submitData({yoyakuId: yoyaku, ticketId: ticket});
            yoyakuElement.current.value = "";
            ticketElement.current.value = "";
        }
    }

    const handleSubmit = () => {
        const ticket = ticketElement.current.value;
        const yoyaku = yoyakuElement.current.value;
        let errorFlg = false;
        let errorData = {ticket:false, yoyaku:false}
        if(ticket.length===0){
            props.setErrorText("入場券QRコードを入力してください");
            errorData["ticket"] = true;
            errorFlg = true;
        }
        if(yoyaku.length===0 && Boolean(props.useGateData.ticket)){
            props.setErrorText("予約QRコードを入力してください");
            errorData["yoyaku"] = true;
            errorFlg = true;
        }
        setInputError(errorData);
        if(!errorFlg){
            keyDownEnter()
        }
    }

    const handleInputReset = () => {
        yoyakuElement.current.value = "";
        ticketElement.current.value = "";
        inputTextArray.splice(0) //配列クリア
        removeFocus();
        props.setErrorText(null);
        resetInputError();
    }

    if(!props.selectedGateId) return null
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
                        inputProps={{ maxLength: useInfo.setting.yoyaku_id_max_length }}
                        disabled={props.isSending || props.isSm}
                        error={isInputError.yoyaku}
                        value={props.isSm ? props.qrDataInTicket.yoyakuId : null}
                    />
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
                        inputProps={{ maxLength: useInfo.setting.ticket_id_max_length }}
                        disabled={props.isSending || props.isSm}
                        error={isInputError.ticket}
                        value={props.isSm ? props.qrDataInTicket.ticketId : null}
                    />
                </div>
                <Typography color="error">{errorMsg}</Typography>
                {!props.isSm &&
                    <div className={classes.buttonBox}>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon/>}
                            onClick={handleSubmit}
                            disabled={props.isSending}
                        >送信</Button>
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={handleInputReset}
                        >リセット</Button>
                    </div>
                }
            </FormBox>
        </PaperWrap>
    )
}