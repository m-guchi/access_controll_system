import React, { useState, useEffect, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import VisitorsTable from '../grid/userList/Table';
import Forbidden from '../templete/Forbidden';
import ReloadButton from '../atoms/ReloadButton';


export default function UserListPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)

    const [userData, setUserData] = useState(null)
    const [isFetching, toggleFetching] = useState(true);
    const [isError, toggleIsError] = useState(false);

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUser = () => {
        getUserData(contextToken.token);
    }

    const getUserData = (token) => {
        toggleFetching(true);
        toggleIsError(false);
        customAxios.get("/user/all/?num="+contextInfo.data.setting.log_user_fetch_max.value ,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setUserData(res.data.data.users);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getUserData(res.data.token);
                }else{
                    toggleIsError(true);
                    toggleFetching(false);
                }
            }else{
                toggleIsError(true);
                toggleFetching(false);
            }
        })
    }

    if(isError) return null;
    return(
        <Forbidden authority="users_mgmt">
            <Grid container>
                <Grid item xs={12}>
                    <ReloadButton onClick={fetchUser}/>
                    <VisitorsTable
                        infoData={contextInfo.data}
                        userData={userData}
                        handleReloadUserData={fetchUser}
                        isFetching={isFetching}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}