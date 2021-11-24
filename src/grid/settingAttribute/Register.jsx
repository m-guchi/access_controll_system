import React, { useState, useContext, useCallback } from 'react'
import { TextField, Typography, Button, FormControlLabel, Checkbox,  Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { infoContext } from '../../context/info';
import { AlertBarContext } from '../../context/AlertBarContext';
import { checkTextNullOrSpace } from '../../atoms/checkText';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';
import ColorPicker from "react-pick-color";


export default function Register (props) {
    const contextAlertBar = useContext(AlertBarContext)
    const contextInfo = useContext(infoContext)

    const [attributeId, setAttributeId] = useState(null);
    const [attributeName, setAttributeName] = useState(null);
    const [color, setColor] = useState('#000000');

    const errorDefaultData = {id: false,name: false};
    const [errorStatus, setErrorStatus] = useState(errorDefaultData);

    const handleId = (e) => setAttributeId(e.target.value);
    const handleName = (e) => setAttributeName(e.target.value);
    const handleColor = useCallback((color) => {
        setColor(color.hex)
    },[]);

    const handleRegisterAttribute = () => {
        setErrorStatus(errorDefaultData);
        let errorFlg = false;
        let errorMsg = "";
        let errStatus = errorDefaultData;
        if(checkTextNullOrSpace(attributeId)){
            errorMsg += "IDを入力してください。";
            errStatus.id = true;
            errorFlg = true;
        }else if(attributeId.length>8){
            errorMsg += "IDは8文字以下です。";
            errStatus.id = true;
            errorFlg = true;
        }
        if(checkTextNullOrSpace(attributeName)){
            errorMsg += "属性名を入力してください。";
            errStatus.name = true;
            errorFlg = true;
        }else if(attributeName.length>50){
            errorMsg += "属性名は50文字以下です。";
            errStatus.name = true;
            errorFlg = true;
        }
        if(errorFlg){
            contextAlertBar.setWarning(errorMsg);
            setErrorStatus(errStatus);
        }else{
            props.handleAttributeData({
                attribute_id: attributeId,
                attribute_name: attributeName,
                color: color,
            })
        }
    }

    return(
        <PaperWrap>
            <Typography variant='h6'>属性登録/更新</Typography>
            <Typography variant='body2' color="error">既に存在するIDを指定した場合、そのIDの情報が更新されます。</Typography>
            <FormBox>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="ID (1-8文字)" required
                        value={attributeId}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleId}
                        error={errorStatus.id}
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="属性名 (1-24文字)" required
                        value={attributeName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleName}
                        error={errorStatus.name}
                        fullWidth
                    />
                </div>
                <div>
                    <Typography variant="caption" color="textSecondary" align="left" display="block">グラフ色(会場内人数)</Typography>
                    <ColorPicker
                        color={color}
                        onChange={handleColor}
                    />
                </div>
                    <Typography color="secondary" variant="body2">属性は登録後に上のテーブルから該当するIDのプレフィックスをダブルクリックして追加してください。</Typography>
                <div>
                    <Button variant="contained" color="primary" onClick={handleRegisterAttribute} >登録</Button>
                </div>
            </FormBox>
        </PaperWrap>
    )
}