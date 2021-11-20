import React, { useContext } from 'react'
import {  Table, TableBody } from '@material-ui/core';
import { AlertBarContext } from '../../context/AlertBarContext';
import { userContext } from '../../context/user';
import PaperWrap from '../../templete/Paper';
import { checkTextNullOrSpace } from '../../atoms/checkText';
import UsersDetailInputItem from './DetailInputItem';
import SelectAuth from './SelectAuth';
import DeleteButton from './DeleteButton';

export default function UsersDetail (props) {
    const contextUser = useContext(userContext)
    const contextAlertBar = useContext(AlertBarContext)
    
    const isMyself = () => {
        if(props.loginUserData && contextUser){
            return props.loginUserData.login_user_id===contextUser.data.login_user_id
        }else{
            return false;
        }
    }

    const handleLoginId = (text) => {
        if(checkTextLength(text,24,"ログインID")){
            const reqData = {
                login_user_id: props.loginUserData.login_user_id,
                login_id: text,
            }
            props.handlePatchLoginUser(reqData)
        }
    }
    const handleUserName = (text) => {
        if(checkTextLength(text,50,"表示名")){
            const reqData = {
                login_user_id: props.loginUserData.login_user_id,
                login_user_name: text,
            }
            props.handlePatchLoginUser(reqData)
        }
    }
    const handlePassword = (text) => {
        if(checkTextLength(text,32,"パスワード")){
            const reqData = {
                login_user_id: props.loginUserData.login_user_id,
                password: text,
            }
            props.handlePatchLoginUser(reqData)
        }
    }
    const handleAuth = (item) => {
        const reqData = {
            login_user_id: props.loginUserData.login_user_id,
            auth_group: item,
        }
        props.handlePatchLoginUser(reqData)
    }
    
    const checkTextLength = (text,maxLength,disText) => {
        if(checkTextNullOrSpace(text)){
            contextAlertBar.setWarning(disText+"は空白にできません。");
            return false;
        }else if(text.length>maxLength){
            contextAlertBar.setWarning(disText+"は"+maxLength+"文字以下です。");
            return false;
        }else{
            return true;
        }
    }

    const handleDeleteLoginUser = () => {
        props.handleDeleteLoginUser(props.loginUserData.login_user_id)
    }

    return(
        <PaperWrap>
            <Table>
                <TableBody>
                    <UsersDetailInputItem
                        name="ID"
                        value={props.loginUserData.login_user_id}
                        isDisable
                    />
                    <UsersDetailInputItem
                        name="ログインID (1-24文字)"
                        value={props.loginUserData.login_id}
                        saveEdit={handleLoginId}
                    />
                    <UsersDetailInputItem
                        name="表示名 (1-50文字)"
                        value={props.loginUserData.login_user_name}
                        saveEdit={handleUserName}
                    />
                    <UsersDetailInputItem
                        name="パスワード (1-32文字)"
                        value=""
                        saveEdit={handlePassword}
                    />
                    <SelectAuth
                        name="権限グループ"
                        value={props.loginUserData.auth_group}
                        saveItem={handleAuth}
                        canEdit={!isMyself()}
                    />
                    {!isMyself() &&
                        <DeleteButton
                            handleDeleteLoginUser={handleDeleteLoginUser}
                        />
                    }
                </TableBody>
            </Table>
        </PaperWrap>
    )
}