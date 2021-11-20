import React, { useState, useEffect, useContext }  from 'react';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { AlertBarContext } from '../context/AlertBarContext';
import { Grid } from '@material-ui/core';
import UsersTable from '../grid/loginUserMgmt/Table';
import UsersRegister from '../grid/loginUserMgmt/Register';
import UsersDetail from '../grid/loginUserMgmt/Detail';

export default function LoginUserMgmtPage (props) {
    const contextToken = useContext(tokenContext)
    const contextAlertBar = useContext(AlertBarContext)

    const [userData, setUserData] = useState(null)
    const [selectUserData, setSelectUserData] = useState(null);

    const [isFetching, setFetching] = useState(true);


    useEffect(() => {
        handleGetLoginUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserListData = (token) => {
        customAxios.get("/login/user/all/",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setUserData(res.data.data);
                    setFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getUserListData(res.data.token);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                    setFetching(false);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                setFetching(false);
            }
        })
    }
    const handleGetLoginUser = () => {
        getUserListData(contextToken.token)
    }

    const patchLoginUserData = (data, token) => {
        customAxios({
            method: "patch",
            url: "/login/user/",
            data: data,
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setSelectUserData(res.data.data);
                    contextAlertBar.setSuccess("ユーザー情報を更新しました")
                    handleGetLoginUser();
                }else{
                    switch(res.data.error.type){
                        case "need_this_token":
                            patchLoginUserData(data, res.data.token);
                            break;
                        case "already_login_id":
                            contextAlertBar.setWarning("入力されたログインID( "+data.login_id+" )は既に使用されています");
                            break;
                        default:
                            contextAlertBar.setOtherError(res.data.error);
                            break;
                    }
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
            }
        })
    }
    const handlePatchLoginUser = (data) => {
        patchLoginUserData(data, contextToken.token)
    }

    const postLoginUserData = (data, token) => {
        customAxios({
            method: "post",
            url: "/login/user/",
            data: data,
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    contextAlertBar.setSuccess("新規ユーザーを登録しました")
                    handleGetLoginUser();
                }else{
                    switch(res.data.error.type){
                        case "need_this_token":
                            postLoginUserData(data, res.data.token);
                            break;
                        case "already_login_id":
                            contextAlertBar.setWarning("入力されたログインID( "+data.login_id+" )は既に使用されています");
                            break;
                        default:
                            contextAlertBar.setOtherError(res.data.error);
                            break;
                    }
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
            }
        })
    }
    const handlePostLoginUser = (data) => {
        postLoginUserData(data, contextToken.token)
    }

    const deleteLoginUserData = (loginUserId, token) => {
        customAxios({
            method: "delete",
            url: "/login/user/",
            data: {login_user_id:loginUserId},
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.status===204){
                    contextAlertBar.setSuccess("ユーザーを削除しました")
                    handleGetLoginUser();
                }else{
                    if(res.data.error.type==="need_this_token"){
                        postLoginUserData(loginUserId, res.data.token);
                    }else{
                        contextAlertBar.setOtherError(res.data.error);
                    }
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
            }
        })
    }
    const handleDeleteLoginUser = (loginUserId) => {
        deleteLoginUserData(loginUserId, contextToken.token)
    }

    return(
        <Forbidden authority="login_users_mgmt">
            <Grid container>
                <Grid item md={5} xs={12}>
                    <UsersTable
                        loginUserData={userData}
                        handleGetLoginUser={handleGetLoginUser}
                        setSelectUserData={setSelectUserData}
                        isFetching={isFetching}
                    />
                </Grid>
                {selectUserData && <Grid item md={4} sm={8} xs={12}>
                    <UsersDetail
                        loginUserData={selectUserData}
                        handlePatchLoginUser={handlePatchLoginUser}
                        handleDeleteLoginUser={handleDeleteLoginUser}
                    />
                </Grid>}
                <Grid item md={3} sm={4} xs={12} >
                    <UsersRegister
                        handlePostLoginUser={handlePostLoginUser}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}