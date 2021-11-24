import React, { useState, useEffect, useContext } from 'react'
import { TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { infoContext } from '../../context/info';
import { AlertBarContext } from '../../context/AlertBarContext';
import { checkTextNullOrSpace } from '../../atoms/checkText';
import PaperWrap from '../../templete/Paper';
import FormBox from '../../templete/FormBox';


export default function UsersRegister (props) {
    const contextInfo = useContext(infoContext)
    const contextAlertBar = useContext(AlertBarContext)

    const [loginId, setLoginId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [auth, setAuth] = useState("default");

    const errorDefaultData = {loginId: false,userName: false,password:false,auth:false};
    const [errorStatus, setErrorStatus] = useState(errorDefaultData);

    const handleLoginId = (e) => setLoginId(e.target.value);
    const handleUserName = (e) => setUserName(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleAuth = (e) => setAuth(e.target.value);

    const handleRegisterUser = () => {
        setErrorStatus(errorDefaultData);
        let errorFlg = false;
        let errorMsg = "";
        let errStatus = errorDefaultData;
        if(checkTextNullOrSpace(loginId)){
            errorMsg += "ログインIDを入力してください。";
            errStatus.loginId = true;
            errorFlg = true;
        }else if(loginId.length>24){
            errorMsg += "ログインIDは24文字以下です。";
            errStatus.loginId = true;
            errorFlg = true;
        }
        if(checkTextNullOrSpace(userName)){
            errorMsg += "表示名を入力してください。";
            errStatus.userName = true;
            errorFlg = true;
        }else if(userName.length>50){
            errorMsg += "表示名は50文字以下です。";
            errStatus.userName = true;
            errorFlg = true;
        }
        if(checkTextNullOrSpace(password)){
            errorMsg += "パスワードを入力してください。";
            errStatus.password = true;
            errorFlg = true;
        }else if(password.length>32){
            errorMsg += "パスワードは32文字以下です。";
            errStatus.password = true;
            errorFlg = true;
        }
        if(errorFlg){
            contextAlertBar.setWarning(errorMsg);
            setErrorStatus(errStatus);
        }else{
            props.handlePostLoginUser({
                login_id: loginId,
                login_user_name: userName,
                password: password,
                auth_group: auth,
            })
        }
    }

    return(
        <PaperWrap>
            <Typography variant='h6'>新規ユーザー登録</Typography>
            <FormBox>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="ログインID (1-24文字)" required
                        onChange={handleLoginId}
                        error={errorStatus.loginId}
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="表示名 (1-50文字)" required
                        onChange={handleUserName}
                        error={errorStatus.userName}
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        color="primary" variant="outlined" size="small" label="パスワード (1-32文字)" required
                        onChange={handlePassword}
                        error={errorStatus.password}
                        fullWidth
                    />
                </div>
                <div>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="select_auth" shrink>権限グループ</InputLabel>
                        <Select
                            value={auth}
                            onChange={handleAuth}
                            labelId="select_auth"
                            error={errorStatus.auth}
                            
                        >
                            {contextInfo.data.auth_list && Object.keys(contextInfo.data.auth_group).map((item,index) => {
                                return <MenuItem key={index} value={item}>{item}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
           </div>
            </FormBox>
        </PaperWrap>
    )
}