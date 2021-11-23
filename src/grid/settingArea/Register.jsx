import React, { useState, useContext } from 'react'
import { TextField, Typography, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { infoContext } from '../../context/info';
import { AlertBarContext } from '../../context/AlertBarContext';
import { checkTextNullOrSpace } from '../../atoms/checkText';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';


export default function Register (props) {
    const contextAlertBar = useContext(AlertBarContext)

    const [areaId, setAreaId] = useState(null);
    const [areaName, setAreaName] = useState(null);
    const [capacity, setCapacity] = useState(0);
    const [hide, setHide] = useState(false);

    const errorDefaultData = {areaId: false,areaName: false,capacity:false,hide:false};
    const [errorStatus, setErrorStatus] = useState(errorDefaultData);

    const handleAreaId = (e) => setAreaId(e.target.value);
    const handleAreaName = (e) => setAreaName(e.target.value);
    const handleCapacity= (e) => setCapacity(e.target.value);
    const handleHide = () => setHide(!hide)

    const handleRegisterArea = () => {
        setErrorStatus(errorDefaultData);
        let errorFlg = false;
        let errorMsg = "";
        let errStatus = errorDefaultData;
        if(checkTextNullOrSpace(areaId)){
            errorMsg += "IDを入力してください。";
            errStatus.areaId = true;
            errorFlg = true;
        }else if(areaId.length>8){
            errorMsg += "IDは8文字以下です。";
            errStatus.areaId = true;
            errorFlg = true;
        }
        if(checkTextNullOrSpace(areaName)){
            errorMsg += "エリア名を入力してください。";
            errStatus.areaName = true;
            errorFlg = true;
        }else if(areaName.length>50){
            errorMsg += "エリア名は50文字以下です。";
            errStatus.areaName = true;
            errorFlg = true;
        }
        if(Number(capacity)<0){
            errorMsg += "定員は0以上1,000,000以下の値を入力してください。";
            errStatus.capacity = true;
            errorFlg = true;
        }
        if(errorFlg){
            contextAlertBar.setWarning(errorMsg);
            setErrorStatus(errStatus);
        }else{
            props.handleAreaData({
                area_id: areaId,
                area_name: areaName,
                capacity: Number(capacity),
                hide: hide,
                color: "#123456" //消す
            })
        }
    }

    return(
        <PaperWrap>
            <Typography variant='h6'>新規エリア登録</Typography>
            <Typography variant='body2' color="error">既に存在するIDを指定した場合、そのIDの情報が更新されます。</Typography>
            <FormBox>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="ID (1-8文字)" required
                        value={areaId}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleAreaId}
                        error={errorStatus.areaId}
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="エリア名 (1-50文字)" required
                        value={areaName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleAreaName}
                        error={errorStatus.areaName}
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="定員" required type="number"
                        value={capacity}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleCapacity}
                        error={errorStatus.capacity}
                        fullWidth
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={<Checkbox checked={!hide} onChange={handleHide} name="hide" />}
                        label="グラフ表示"
                    />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={handleRegisterArea} >登録</Button>
                </div>
            </FormBox>
        </PaperWrap>
    )
}