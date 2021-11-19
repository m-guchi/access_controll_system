import React, { useState, useEffect, useContext }  from 'react';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { Grid } from '@material-ui/core';
import UsersTable from '../grid/loginUserMgmt/Table';
import UsersRegister from '../grid/loginUserMgmt/Register';
import UsersDetail from '../grid/loginUserMgmt/Detail';

export default function LoginUserMgmtPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)

    const [userData, setUserData] = useState(null)
    const [selectUserData, setSelectUserData] = useState(null);

    const [isFetching, toggleFetching] = useState(true);
    const [isError, toggleIsError] = useState(false);

    useEffect(() => {
        getUserListData(contextToken.token)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserListData = (token) => {
        customAxios.get("/login/user/all/",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setUserData(res.data.data);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getUserListData(res.data.token);
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
        <Forbidden authority="login_users_mgmt">
            <Grid container>
                <Grid item md={5} xs={12}>
                    <UsersTable
                        userData={userData}
                        getUserListData={()=>getUserListData(contextToken.token)}
                        gateData={contextInfo.data.gate}
                        setSelectUserData={setSelectUserData}
                        isFetching={isFetching}
                    />
                </Grid>
                {selectUserData && <Grid item md={4} sm={8} xs={12}>
                    <UsersDetail
                        gateData={contextInfo.data.gate}
                        userData={selectUserData}
                        setSelectUserData={setSelectUserData}
                        getUserListData={()=>getUserListData(contextToken.token)}
                    />
                </Grid>}
                <Grid item md={3} sm={4} xs={12} >
                    <UsersRegister token={contextToken.token}/>
                </Grid>
            </Grid>
        </Forbidden>
    )
}