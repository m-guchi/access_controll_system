import React, { useState, useEffect, useContext }  from 'react';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import { tokenContext } from '../context/token';
import { Grid } from '@material-ui/core';
import AuthorityTable from '../grid/authorityManagement/Table';
import AuthorityDetail from '../grid/authorityManagement/Detail';

export default function AuthorityManagementPage (props) {
    const useToken = useContext(tokenContext)
    const [authorityData, setAuthorityData] = useState(null);
    const [authorityAllData, setAuthorityAllData] = useState(null)
    const [selectData, setSelectData] = useState(null);

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
                    const data = res.data;
                    let groupArr = [];
                    Object.keys(data).forEach((key) => {
                        groupArr = groupArr.concat(data[key]["group"]);
                    })
                    const groupArrNoDuplicate = Array.from(new Set(groupArr));
                    setAuthorityAllData(groupArrNoDuplicate);
                    setAuthorityData(res.data);
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
                        getAuthorityListData={()=>getAuthorityListData(token)}
                        setSelectData={setSelectData}
                    />
                </Grid>
                {selectData && <Grid item md={4} sm={8} xs={12}>
                    <AuthorityDetail
                        authorityData={selectData}
                        authorityAllData={authorityAllData}
                        getAuthorityListData={()=>getAuthorityListData(token)}
                        setSelectData={setSelectData}
                    />
                </Grid>}
            </Grid>
        </Forbidden>
    )
}