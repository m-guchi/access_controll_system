import React, { useState, useEffect, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import CountTable from '../grid/gateCount/Table';
import HallCount from '../grid/gateCount/HallCount';
import Forbidden from '../templete/Forbidden';

const periodMinute = 5;

export default function GateCountPage (props) {
    const useToken = useContext(tokenContext);
    const infoData = useContext(infoContext);

    const [gateCount, setGateCount] = useState(null)
    const [visitorsCount, setVisitorsCount] = useState(null)

    useEffect(() => {
        getGateCount(useToken.token);
        getVisitorsCount(useToken.token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getGateCount = (token) => {
        customAxios.get("/gate/visitor?period="+periodMinute,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    const token = res.data.info.token;
                    useToken.set(token);
                    getGateCount(token);
                }else{
                    setGateCount(res.data)
                }
            }
        })
    }

    const getVisitorsCount = (token) => {
        customAxios.get("/area/visitor/last",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    const token = res.data.info.token;
                    useToken.set(token);
                    getVisitorsCount(token);
                }else{
                    setVisitorsCount(res.data);
                }
            }
        })
    }

    if(!infoData) return null;

    return(
        <Forbidden authority="visitors_count">
            <Grid container>
                <Grid item md={6} xs={12}>
                    <CountTable gateCount={gateCount} getGateCount={()=>getGateCount(useToken.token)} gateInfo={infoData.gate} periodMinute={periodMinute}/>
                </Grid>
                <Grid item md={6} xs={12}>
                    <HallCount gateCount={gateCount} visitorsCount={visitorsCount} gateInfo={infoData.gate}/>
                </Grid>
            </Grid>
        </Forbidden>
    )
}