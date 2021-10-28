import React, { useState, useEffect, useContext }  from 'react';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { Grid } from '@material-ui/core';
import UsersTable from '../grid/usersManagement/Table';
import UsersRegister from '../grid/usersManagement/Register';
import UsersDetail from '../grid/usersManagement/Detail';

export default function UsersManagementPage (props) {
    const userToken = useContext(tokenContext)
    const info = useContext(infoContext)
    const [usersData, setUsersData] = useState(null)
    const [selectUserData, setSelectUserData] = useState(null);

    const gateData = info ? info.gate : null;

    useEffect(() => {
        getUserListData(userToken.token)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserListData = (token) => {
        customAxios.get("/user/all",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    const token = res.data.info.token;
                    userToken.set(token);
                    getUserListData(token);
                }else{
                    setUsersData(res.data)
                }
            }
        })
    }

    return(
        <Forbidden authority="users_management">
            <Grid container>
                <Grid item md={8} xs={12}>
                    <UsersTable
                        usersData={usersData}
                        getUserListData={()=>getUserListData(userToken.token)}
                        gateData={gateData}
                        setSelectUserData={setSelectUserData}
                    />
                </Grid>
                {selectUserData && <Grid item md={4} sm={8} xs={12}>
                    <UsersDetail
                        token={userToken.token}
                        gateData={gateData}
                        userData={selectUserData}
                        setSelectUserData={setSelectUserData}
                    />
                </Grid>}
                <Grid item sm={4} xs={12} >
                    <UsersRegister token={userToken.token}/>
                </Grid>
            </Grid>
        </Forbidden>
    )
}