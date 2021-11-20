import React, { useState, useEffect, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import { AlertBarContext } from '../context/AlertBarContext';
import UserSearchTable from '../grid/userSearch/Table';
import Forbidden from '../templete/Forbidden';
import SearchBox from '../grid/userSearch/SearchBox';


export default function UserSearchPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)
    const contextAlertBar = useContext(AlertBarContext)

    const [userList, setUserList] = useState(null)
    const [isFetching, toggleFetching] = useState(false);

    useEffect(() => {
        // fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSearchUserData = (data, token) => {
        toggleFetching(true);
        customAxios.get("/user/pass/search/", {
            params: {
                area_id: data.areaId,
                start_date: data.startDate,
                end_date: data.endDate,
            },
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setUserList(res.data.data.users);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getSearchUserData(data, res.data.token);
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
    const handleSearchUser = (data) => {
        getSearchUserData(data, contextToken.token);
    }

    return(
        <Forbidden authority="users_mgmt">
            <Grid container>
                <Grid item xs={12}>
                    <SearchBox handleSearchUser={handleSearchUser} />
                </Grid>
                <Grid item xs={12}>
                    <UserSearchTable
                        infoData={contextInfo.data}
                        userList={userList}
                        isFetching={isFetching}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}