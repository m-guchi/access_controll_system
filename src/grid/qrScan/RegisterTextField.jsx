import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { infoContext } from '../../context/info';
import { TextField, Button, Typography } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';
import SendIcon from '@material-ui/icons/Send';

export default function RegisterTextField (props) {

    const contextInfo = useContext(infoContext)

    const userElement = useRef(null);
    const ticketElement = useRef(null);

    const selectGateData = contextInfo.data.gate[props.selectedGateId];

    const handleSetUserId = (e) => props.setTextBox(false, e.target.value);
    const handleSetTicketId = (e) => props.setTextBox(true, e.target.value);

    const [inputTextString, setInputTextSrtring] = useState("");

    const handleKeyDown = (e) => {
        const key = e.key;
        if(["Process"].includes(key)){
            // setErrorMsg("全角文字は使用できません");
        }else{
            // setErrorMsg(null);
        }
        if(["Escape"," "].includes(key)){
            setInputTextSrtring("")
            removeFocus();
        }else if(key==="Enter"){ //Enter
            if(props.checkTicketId(inputTextString)){
                console.log("ticket")
                props.setTextBox(true, inputTextString)
            }else{
                console.log("user")
                props.setTextBox(false, inputTextString)
            }
            setInputTextSrtring("")
            // keyDownEnter();
            removeFocus();
        }else if(["Backspace","Delete","Shift","Tab","Process","Zenkaku"].includes(key)){
        }else{
            const text = inputTextString+key;
            setInputTextSrtring(text);
            // inputTextArray.push(key);
            // if(prefixStringArr.includes(key)){ //予約ID
            //     const inputTextString = inputTextArray.join("");
            //     const isYoyakuMatch = prefixArr.some((val) => inputTextString===val)
            //     if(isYoyakuMatch){
            //         keyDownYoyaku(inputTextString);
            //     }
            // }
            // if(ticketPrefixStringArr.includes(key)){ //入場券QRコード
            //     const inputTextString = inputTextArray.join("");
            //     const isTicketMatch = ticketPrefixArr.some((val) => inputTextString===val)
            //     if(isTicketMatch){
            //         keyDownTicket(inputTextString);
            //     }
            // }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [props.selectedGateId, handleKeyDown]);

    const removeFocus = () => {
        userElement.current.blur();
        ticketElement.current.blur();
    }


    
    return(
        <PaperWrap>
            <FormBox>
                <div>
                    <TextField
                        inputRef={userElement}
                        label="ユーザーID"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: contextInfo.data.setting.user_id_max_length }}
                        onChange={handleSetUserId}
                        value={props.inputTextValue.userId}
                    />
                </div>
                <div>
                    <TextField
                        inputRef={ticketElement}
                        label="チケットID"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: contextInfo.data.setting.ticket_id_max_length }}
                        onChange={handleSetTicketId}
                        value={props.inputTextValue.ticketId}
                    />
                </div>
            </FormBox>
        </PaperWrap>
    )
}