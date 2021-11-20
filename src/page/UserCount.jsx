import React, { useState, useEffect, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { AlertBarContext } from '../context/AlertBarContext';
import { customAxios } from '../templete/Axios';
import CountTable from '../grid/userCount/Table';
import UserCountBarChar from '../grid/userCount/UserCountBarChar'
import Forbidden from '../templete/Forbidden';

export default function UserCountPage (props) {
    const contextToken = useContext(tokenContext);
    const contextAlertBar = useContext(AlertBarContext)

    const [userCount, setUserCount] = useState(null);
    const [isFetching, toggleFetching] = useState(true);

    useEffect(() => {
        handleGetUserCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserCount = (token) => {
        customAxios.get("/user/count/",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setUserCount(res.data.data);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getUserCount(res.data.token);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                    toggleFetching(false);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleFetching(false);
            }
        })
    }
    const handleGetUserCount = () => {
        getUserCount(contextToken.token)
    }

    return(
        <Forbidden authority="users_mgmt">
            <Grid container>
                <Grid item md={6} xs={12}>
                    <CountTable userCount={userCount} handleGetUserCount={handleGetUserCount}/>
                </Grid>
                <Grid item md={6} xs={12}>
                    <UserCountBarChar userCount={userCount}/>
                </Grid>
            </Grid>
        </Forbidden>
    )
}