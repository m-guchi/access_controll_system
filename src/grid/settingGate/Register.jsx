import React, { useState, useContext } from 'react'
import { TextField, Typography, Button, FormControlLabel, Checkbox,  Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { infoContext } from '../../context/info';
import { AlertBarContext } from '../../context/AlertBarContext';
import { checkTextNullOrSpace } from '../../atoms/checkText';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';


export default function Register (props) {
    const contextAlertBar = useContext(AlertBarContext)
    const contextInfo = useContext(infoContext)


    const [gateId, setGateId] = useState(null);
    const [gateName, setGateName] = useState(null);
    const [inArea, setInArea] = useState(null);
    const [outArea, setOutArea] = useState(null);
    const [canMakeTicket, setCanMakeTicket] = useState(false);

    const errorDefaultData = {gateId: false,gateName: false,inArea:false,outArea:false,canMakeTicket:false};
    const [errorStatus, setErrorStatus] = useState(errorDefaultData);

    const handleGateId = (e) => setGateId(e.target.value);
    const handleGateName = (e) => setGateName(e.target.value);
    const handleInArea= (e) => setInArea(e.target.value);
    const handleOutArea= (e) => setOutArea(e.target.value);
    const handleCanMakeTicket = () => setCanMakeTicket(!canMakeTicket)

    const handleRegisterGate = () => {
        setErrorStatus(errorDefaultData);
        let errorFlg = false;
        let errorMsg = "";
        let errStatus = errorDefaultData;
        if(checkTextNullOrSpace(gateId)){
            errorMsg += "IDを入力してください。";
            errStatus.gateId = true;
            errorFlg = true;
        }else if(gateId.length>8){
            errorMsg += "IDは8文字以下です。";
            errStatus.gateId = true;
            errorFlg = true;
        }
        if(checkTextNullOrSpace(gateName)){
            errorMsg += "受付名を入力してください。";
            errStatus.gateName = true;
            errorFlg = true;
        }else if(gateName.length>50){
            errorMsg += "受付名は50文字以下です。";
            errStatus.gateName = true;
            errorFlg = true;
        }
        if(checkTextNullOrSpace(inArea)){
            errorMsg += "次エリアを選択してください。";
            errStatus.inArea = true;
            errorFlg = true;
        }
        if(checkTextNullOrSpace(outArea)){
            errorMsg += "前エリアを選択してください。";
            errStatus.outArea = true;
            errorFlg = true;
        }
        if(errorFlg){
            contextAlertBar.setWarning(errorMsg);
            setErrorStatus(errStatus);
        }else{
            props.handleGateData({
                gate_id: gateId,
                gate_name: gateName,
                in_area: inArea,
                out_area: outArea,
                can_make_ticket: canMakeTicket,
            })
        }
    }

    return(
        <PaperWrap>
            <Typography variant='h6'>受付登録/更新</Typography>
            <Typography variant='body2' color="error">既に存在するIDを指定した場合、そのIDの情報が更新されます。</Typography>
            <FormBox>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="ID (1-8文字)" required
                        value={gateId}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleGateId}
                        error={errorStatus.gateId}
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="受付名 (1-50文字)" required
                        value={gateName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleGateName}
                        error={errorStatus.gateName}
                        fullWidth
                    />
                </div>
                <div>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="select_out_area">前エリア</InputLabel>
                        <Select
                            value={outArea}
                            onChange={handleOutArea}
                            labelId="select_out_area"
                            error={errorStatus.outArea}
                        >
                            {contextInfo.data.area && Object.keys(contextInfo.data.area).map((item,index) => {
                                const areaName = contextInfo.data.area[item].area_name;
                                return <MenuItem key={index} value={item}>{areaName} ({item})</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                ▼
                <div>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="select_in_area">次エリア</InputLabel>
                        <Select
                            value={inArea}
                            onChange={handleInArea}
                            labelId="select_in_area"
                            error={errorStatus.inArea}
                        >
                            {contextInfo.data.area && Object.keys(contextInfo.data.area).map((item,index) => {
                                const areaName = contextInfo.data.area[item].area_name;
                                return <MenuItem key={index} value={item}>{areaName} ({item})</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControlLabel
                        control={<Checkbox checked={canMakeTicket} onChange={handleCanMakeTicket} name="hide" />}
                        label="チケットとユーザーIDを紐付け (チケットを使用しない場合は、チェックをつけない)"
                    />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={handleRegisterGate} >登録</Button>
                </div>
            </FormBox>
        </PaperWrap>
    )
}