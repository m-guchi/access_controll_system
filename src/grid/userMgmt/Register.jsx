import React, { useState } from 'react'
import { TextField, Typography, Button } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import { customAxios } from '../../templete/Axios';
import FormBox from '../../templete/FormBox';


export default function UsersRegister (props) {

    const [registerMsg, setRegisterMsg] = useState(null);
    const [loginId, setLoginId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);

    const handleLoginId = (e) => setLoginId(e.target.value);
    const handleUserName = (e) => setUserName(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const registerUser = (token) => {
        if(loginId==null){
            setRegisterMsg("ログインIDを入力してください");
            return 0;
        }
        if(userName==null){
            setRegisterMsg("表示名を入力してください");
            return 0;
        }
        if(password==null){
            setRegisterMsg("パスワードを入力してください");
            return 0;
        }
        customAxios({
            method: "post",
            url: "/user/",
            data: {
                login_id: loginId,
                user_name: userName,
                password: password,
            },
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    registerUser(res.data.info.token)
                }else{
                    setRegisterMsg("登録しました")
                }
            }else{
                if(res.status===400 && res.data.error.type==="already_login_id"){
                    setRegisterMsg("このログインIDは既に使用されています");
                }else{
                    setRegisterMsg("登録に失敗しました");
                }
            }
        })
    }

    return(
        <PaperWrap>
            <Typography variant='h6'>ユーザー登録</Typography>
            <FormBox>
                <div>
                    <TextField color="primary" variant="outlined" size="small" label="ログインID" onChange={handleLoginId} /><br/>
                </div>
                <div>
                    <TextField color="primary" variant="outlined" size="small" label="表示名" onChange={handleUserName} /><br/>
                </div>
                <div>
                    <TextField color="primary" variant="outlined" size="small" label="パスワード" onChange={handlePassword} /><br/>
                </div>
                <div>
                    <Typography color="error" variant="body2">{registerMsg}</Typography>
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={()=>registerUser(props.token)} >登録</Button>
                </div>
            </FormBox>
        </PaperWrap>
    )
}