import React, { useState, useEffect, useContext }  from 'react';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import LogGateTable from '../grid/logGate/Table';

const intervalTime = 60000;

export default function LogGatePage (props) {
    const useToken = useContext(tokenContext)
    const useInfo = useContext(infoContext)

    const [logData, setLogdata] = useState(null);

    useEffect(() => {
        getGateLog(useToken.token)
        const interval = setInterval(() => {
            getGateLog(useToken.token);
        }, intervalTime);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const dataMax = useInfo.setting.log_gate_fetch_max;

    const getGateLog = (token) => {
        customAxios.get("/gate/all?max="+dataMax,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    const token = res.data.info.token
                    useToken.set(token)
                    getGateLog(token)
                }else{
                    setLogdata(res.data)
                }
            }
        })
    }

    return(
        <Forbidden authority="log_watcher">
            <LogGateTable logData={logData} infoData={useInfo}/>
        </Forbidden>
    )
}