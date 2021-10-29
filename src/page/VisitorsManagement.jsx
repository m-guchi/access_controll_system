import React, { useState, useEffect, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import VisitorsTable from '../grid/visitorsManagement/Table';
import Forbidden from '../templete/Forbidden';

export default function VisitorsManagementPage (props) {
    const useToken = useContext(tokenContext)
    const useInfo = useContext(infoContext)
    const [visitorsData, setVisitorsData] = useState(null)

    useEffect(() => {
        getVisitorsData(useToken.token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getVisitorsData = (token) => {
        customAxios.get("/visitor/all",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    getVisitorsData(res.data.info.token);
                }else{
                    setVisitorsData(res.data);
                }
            }
        })
    }

    const handleGetVisitorsData = () => {
        getVisitorsData(useToken.token)
    }

    return(
        <Forbidden authority="visitors_management">
            <Grid container>
                <Grid item xs={12}>
                    <VisitorsTable
                        infoData={useInfo}
                        visitorsData={visitorsData}
                        handleGetVisitorsData={handleGetVisitorsData}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}