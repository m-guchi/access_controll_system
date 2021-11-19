import React, { useState, useContext } from 'react'
import { TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { tokenContext } from '../../context/token';
import { infoContext } from '../../context/info';
import PaperWrap from '../../templete/Paper';
import { customAxios } from '../../templete/Axios';
import FormBox from '../../templete/FormBox';


export default function UsersRegister () {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)

    const [registerMsg, setRegisterMsg] = useState("");

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

    const handleRegisterUser = () => registerUser(contextToken.token)
    const registerUser = (token) => {
        setRegisterMsg("");
        setErrorStatus(errorDefaultData);
        let errorFlg = false;
        let errorMsg = "";
        let errStatus = errorDefaultData;
        if(loginId===null || loginId.length<1){
            errorMsg += "ログインIDを入力してください。";
            errStatus.loginId = true;
            errorFlg = true;
        }else if(loginId.length>24){
            errorMsg += "ログインIDは24文字以下です。";
            errStatus.loginId = true;
            errorFlg = true;
        }
        if(userName===null || userName.length<1){
            errorMsg += "表示名を入力してください。";
            errStatus.userName = true;
            errorFlg = true;
        }else if(userName.length>50){
            errorMsg += "表示名は50文字以下です。";
            errStatus.userName = true;
            errorFlg = true;
        }
        if(password===null || password.length<1){
            errorMsg += "パスワードを入力してください。";
            errStatus.password = true;
            errorFlg = true;
        }else if(password.length>32){
            errorMsg += "パスワードは32文字以下です。";
            errStatus.password = true;
            errorFlg = true;
        }
        if(errorFlg){
            setRegisterMsg(errorMsg);
            setErrorStatus(errStatus);
        }else{
            customAxios({
                method: "post",
                url: "/login/user/",
                data: {
                    login_id: loginId,
                    login_user_name: userName,
                    password: password,
                    auth_group: auth
                },
                headers: {"token": token}
            })
            .then(res => {
                if(res.status<401){
                    if(res.data.token) contextToken.set(res.data.token);
                    if(res.data.ok){
                        setRegisterMsg("登録しました")
                    }else{
                        switch(res.data.error.type){
                            case "need_this_token":
                                registerUser(res.data.token);
                                break;
                            case "invalid_param_length":
                                setRegisterMsg("入力データの文字数が不適です");
                                break;
                            case "already_login_id":
                                setRegisterMsg("このログインIDは既に使用されています");
                                errStatus.loginId = true;
                                break;
                            case "not_in_authority_group":
                                setRegisterMsg("この権限グループは存在しません");
                                errStatus.auth = true;
                                break;
                            default:
                                setRegisterMsg("エラーが発生しました。再度登録を行ってください。");
                                break;
                        }
                        setErrorStatus(errStatus);
                    }
                }else{
                    setRegisterMsg("エラーが発生しました。再度登録を行ってください。");
                }
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
                        <InputLabel id="select_auth">権限グループ</InputLabel>
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
                <div>
                    <Typography color="error" variant="body2">{registerMsg}</Typography>
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={handleRegisterUser} >登録</Button>
                </div>
            </FormBox>
        </PaperWrap>
    )
}