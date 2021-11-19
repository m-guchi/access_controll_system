import React, { useState, useEffect, useContext } from 'react'
import { Typography, Table, TableBody } from '@material-ui/core';
import { tokenContext } from '../../context/token';
import PaperWrap from '../../templete/Paper';
import { customAxios } from '../../templete/Axios';
import { userContext } from '../../context/user';
import UsersDetailInputItem from './DetailInputItem';
import SelectAuth from './SelectAuth';

export default function UsersDetail (props) {
    const contextToken = useContext(tokenContext)
    const contextUser = useContext(userContext)
    
    const userData = props.userData;

    const [errorMsg, setErrorMsg] = useState(null);
    

    useEffect(() => {
        setErrorMsg(null);
    },[userData])

    const isEditUserMyself = () => {
        if(userData && contextUser){
            return userData.login_user_id===contextUser.data.login_user_id
        }else{
            return false;
        }
    }

    const patchLoginUserData = (data, token) => {
        customAxios({
            method: "patch",
            url: "/login/user/",
            data: data,
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    props.setSelectUserData(res.data.data);
                    setErrorMsg(null);
                    props.getUserListData();
                }else{
                    switch(res.data.error.type){
                        case "need_this_token":
                            patchLoginUserData(data, res.data.token);
                            break;
                        case "invalid_param_length":
                            setErrorMsg("入力データの文字数が不適です");
                            break;
                        case "not_in_login_user_id":
                            setErrorMsg("このIDのユーザーは存在しません");
                            break;
                        case "already_login_id":
                            setErrorMsg("このログインIDは既に使用されています");
                            break;
                        case "not_in_authority_group":
                            setErrorMsg("この権限グループは存在しません");
                            break;
                        default:
                            setErrorMsg("エラーが発生しました。再度登録を行ってください。");
                            break;
                    }
                }
            }else{
                setErrorMsg("エラーが発生しました。一度ログアウトしてください。");
            }
        })
    }

    const handleLoginId = (text) => {
        if(checkTextLength(text,24,"ログインID")){
            const reqData = {
                login_user_id: userData.login_user_id,
                login_id: text,
            }
            patchLoginUserData(reqData, contextToken.token)
        }
    }
    const handleUserName = (text) => {
        if(checkTextLength(text,50,"表示名")){
            const reqData = {
                login_user_id: userData.login_user_id,
                login_user_name: text,
            }
            patchLoginUserData(reqData, contextToken.token)
        }
    }
    const handlePassword = (text) => {
        if(checkTextLength(text,32,"パスワード")){
            const reqData = {
                login_user_id: userData.login_user_id,
                password: text,
            }
            patchLoginUserData(reqData, contextToken.token)
        }
    }

    const checkTextLength = (text,maxLength,disText) => {
        if(text===null || text.length<1){
            setErrorMsg(disText+"は空白にできません。");
            return false;
        }else if(text.length>maxLength){
            setErrorMsg(disText+"は"+maxLength+"文字以下です。");
            return false;
        }else{
            return true;
        }
    }

    const handleAuth = (item) => {
        const reqData = {
            login_user_id: userData.login_user_id,
            auth_group: item,
        }
        patchLoginUserData(reqData, contextToken.token)
    }


    return(
        <PaperWrap>
            <Typography variant='body2' color="error">{errorMsg}</Typography>
            <Table>
                <TableBody>
                    <UsersDetailInputItem
                        name="ID"
                        value={userData.login_user_id}
                        isDisable
                    />
                    <UsersDetailInputItem
                        name="ログインID (1-24文字)"
                        value={userData.login_id}
                        saveEdit={handleLoginId}
                    />
                    <UsersDetailInputItem
                        name="表示名 (1-50文字)"
                        value={userData.login_user_name}
                        saveEdit={handleUserName}
                    />
                    <UsersDetailInputItem
                        name="パスワード (1-32文字)"
                        value=""
                        saveEdit={handlePassword}
                    />
                    <SelectAuth
                        name="権限グループ"
                        value={userData.auth_group}
                        saveItem={handleAuth}
                        canEdit={!isEditUserMyself()}
                    />
                </TableBody>
            </Table>
        </PaperWrap>
    )
}