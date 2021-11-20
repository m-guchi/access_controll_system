import React, { useState, useEffect, useContext }  from 'react';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import { AlertBarContext } from '../context/AlertBarContext';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { userContext } from '../context/user';
import { Grid } from '@material-ui/core';
import AuthTable from '../grid/authMgmt/Table';

export default function AuthMgmtPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)
    const contextUser = useContext(userContext)

    const [isFetching, setFetching] = useState(false);
    const [isError, setError] = useState(false);

    const updateInfoData = (token) => {
        customAxios.get("/setting/",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    contextInfo.set(res.data.data);
                    setFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    updateInfoData(res.data.token);
                }else{
                    setError(true);
                }
            }else{
                setError(true);
            }
        })
    }

    const postAuth = (data, token) => {
        setFetching(true)
        customAxios.post("/login/user/auth/",data,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    fetchInfoData();
                }else if(res.data.error.type==="need_this_token"){
                    postAuth(data, res.data.token);
                }else if(res.data.error.type==="not_in_auth_name"){
                    setError(true);
                }else{
                    setError(true);
                }
            }else{
                setError(true);
            }
        })
    }

    const deleteAuth = (data, token) => {
        setFetching(true)
        customAxios.delete("/login/user/auth/",{
            data: data,
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===204){
                fetchInfoData();
            }else if(res.status<401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.error.type==="need_this_token"){
                    deleteAuth(data, res.data.token);
                }else if(res.data.error.type==="cannot_delete_last_auth_group"){
                    setError(true);
                }else{
                    setError(true);
                }
            }else{
                setError(true);
            }
        })
    }

    const fetchInfoData = () => {
        setFetching(true)
        updateInfoData(contextToken.token);
    }

    const handleChangeAuth = (authName, authGroup, value) => {
        if(authName==="login_users_mgmt" && authGroup===contextUser.data.auth_group){
            //error
            fetchInfoData();
        }else{
            const data = {
                auth_group: authGroup,
                auth_name: authName
            };
            if(value){
                postAuth(data, contextToken.token);
            }else{
                deleteAuth(data, contextToken.token);
            }
        }
    }

    return(
        <Forbidden authority="login_users_mgmt">
            <Grid container>
                <Grid item md={8} xs={12}>
                    <AuthTable
                        fetchInfoData={fetchInfoData}
                        isFetching={isFetching}
                        handleChangeAuth={handleChangeAuth}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}