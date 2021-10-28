import React, { useState, useEffect, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { customAxios } from '../templete/Axios';
import CountTable from '../grid/visitorsCount/Table';
import NumPieChart from '../grid/visitorsCount/NumPieChart';
import NumPieChartAttribute from '../grid/visitorsCount/NumPieChartAttribute';
import Forbidden from '../templete/Forbidden';

export default function VisitorsCountPage (props) {
    const useToken = useContext(tokenContext)

    const [visitorsCount, setVisitorsCount] = useState(null)

    useEffect(() => {
        getVisitorsCount(useToken.token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getVisitorsCount = (token) => {
        customAxios.get("/area/visitor/last",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    getVisitorsCount(res.data.info.token);
                }else{
                    setVisitorsCount(res.data);
                }
            }
        })
    }

    return(
        <Forbidden authority="visitors_count">
            <Grid container>
                <Grid item md={6} xs={12}>
                    <CountTable visitorsCount={visitorsCount} getVisitorsCount={()=>getVisitorsCount(useToken.token)} dashboard={props.dashboard}/>
                </Grid>
                <Grid item md={6} xs={12}>
                    <NumPieChart visitorsCount={visitorsCount}/>
                </Grid>
                {(!props.dashboard) &&
                    <Grid item md={12} xs={12}>
                        <NumPieChartAttribute visitorsCount={visitorsCount}/>
                    </Grid>
                }
            </Grid>
        </Forbidden>
    )
}