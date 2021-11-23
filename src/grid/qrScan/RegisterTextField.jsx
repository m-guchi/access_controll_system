import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { infoContext } from '../../context/info';
import { AlertBarContext } from '../../context/AlertBarContext';
import { TextField, Button, Typography } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';

export default function RegisterTextField (props) {

    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);


    const userElement = useRef(null);
    const ticketElement = useRef(null);

    const isUseTicketMode = Boolean(Number(contextInfo.data.setting.use_ticket.value))

    const [selectTextType, setSelectTextType] = useState(null); //[null,hide,user,ticket]


    const handleSetUserId = (e) => {
        if(e.target.value.length>30){
            contextAlertBar.setWarning("ユーザーIDは31文字以上入力できません")
        }else{
            props.setTextBox(false, e.target.value, false);
        }
        setSelectTextType(e.target.value.length===0?null:"user")
    }
    const handleSetTicketId = (e) => {
        if(e.target.value.length>30){
            contextAlertBar.setWarning("チケットIDは31文字以上入力できません")
        }else{
            props.setTextBox(true, e.target.value, false);
        }
        setSelectTextType(e.target.value.length===0?null:"ticket")
    }

    const [inputTextString, setInputTextSrtring] = useState("");

    const handleKeyDown = (e) => {
        const key = e.key;
        if(["Escape","Esc"].includes(key)){
            setInputTextSrtring("");
            setSelectTextType(null);
            removeFocus();
        }else if(key==="Enter"){
            if(selectTextType==="hide"){
                if(props.checkTicketId(inputTextString)){
                    props.setTextBox(true, inputTextString, true)
                }else{
                    props.setTextBox(false, inputTextString, true)
                }
            }else if(selectTextType!==null){
                props.onClickEnter()
            }
            setInputTextSrtring("");
            setSelectTextType(null);
            removeFocus();
        }else if(key.length>1){
        }else{
            setSelectTextType("hide");
            const text = inputTextString+key;
            if(text.length<=30){
                setInputTextSrtring(text);
            }else{
                contextAlertBar.setWarning("31文字以上入力できません")
            }
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
        if(isUseTicketMode) ticketElement.current.blur();
    }


    const textStringIsNotInput = (inputTextString==="");
    const textTypeField = props.isSending ? "データ送信中" 
            : selectTextType==="ticket" ? "チケットID入力中"
            : selectTextType==="user" ? "ユーザーID入力中"
            : textStringIsNotInput||selectTextType===null ? "入力待ち"
            : inputTextString;
    const textTypeColor = textTypeField==="データ送信中" ? "secondary"
            : textTypeField==="入力待ち" ? "primary"
            : "default";
    
    return(
        <PaperWrap>
            <FormBox>
                <div>
                    <Typography variant="body1" color={textTypeColor}>{textTypeField}</Typography>
                </div>
                <div>
                    <TextField
                        inputRef={userElement}
                        label="ユーザーID"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: 31 }}
                        onChange={handleSetUserId}
                        value={props.inputTextValue.userId}
                        disabled={props.isSending}
                    />
                </div>
                {isUseTicketMode &&
                    <div>
                        <TextField
                            inputRef={ticketElement}
                            label="チケットID"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: 31 }}
                            onChange={handleSetTicketId}
                            value={props.inputTextValue.ticketId}
                            disabled={props.isSending}
                        />
                    </div>
                }
            </FormBox>
        </PaperWrap>
    )
}