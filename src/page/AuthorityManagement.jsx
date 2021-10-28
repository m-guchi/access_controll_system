import React, { useState, useEffect, useContext }  from 'react';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { Grid } from '@material-ui/core';
import AuthorityTable from '../grid/authorityManagement/Table';
import UsersRegister from '../grid/usersManagement/Register';
import UsersDetail from '../grid/usersManagement/Detail';

export default function AuthorityManagementPage (props) {
    const useToken = useContext(tokenContext)
    const useInfo = useContext(infoContext)
    const [authorityData, setAuthorityData] = useState(null)
    const [selectAuthorityData, setSelectAuthorityData] = useState(null);

    // const gateData = useInfo ? useInfo.gate : null;
    const token = useToken.token

    useEffect(() => {
        getAuthorityListData(token)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAuthorityListData = (token) => {
        customAxios.get("/authority/",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    const token = res.data.info.token;
                    useToken.set(token);
                    getAuthorityListData(token);
                }else{
                    setAuthorityData(res.data)
                }
            }
        })
    }

    return(
        <Forbidden authority="users_management">
            <Grid container>
                <Grid item md={8} xs={12}>
                    <AuthorityTable
                        data={authorityData}
                        // getUserListData={()=>getAuthorityListData(token)}
                        // gateData={gateData}
                        // setSelectUserData={setSelectUserData}
                    />
                </Grid>
                {/* {selectUserData && <Grid item md={4} sm={8} xs={12}>
                    <UsersDetail
                        token={token}
                        gateData={gateData}
                        userData={selectUserData}
                        setSelectUserData={setSelectUserData}
                        getUserListData={()=>getAuthorityListData(token)}
                    />
                </Grid>} */}
            </Grid>
        </Forbidden>
    )
}