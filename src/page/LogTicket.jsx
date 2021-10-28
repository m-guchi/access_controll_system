import React, { useState, useEffect, useContext }  from 'react';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import LogTicketTable from '../grid/logTicket/Table';

const intervalTime = 60000;

export default function LogTicketPage (props) {
    const useToken = useContext(tokenContext)
    const useInfo = useContext(infoContext)

    const [logData, setLogdata] = useState(null);
    const [isFetching, toggleFetching] = useState(true);

    useEffect(() => {
        getTicketLog(useToken.token);
        const interval = setInterval(() => {
            getTicketLog(useToken.token);
        }, intervalTime);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const dataMax = useInfo.setting.log_ticket_fetch_max;

    

    const getTicketLog = (token) => {
        toggleFetching(true);
        customAxios.get("/visitor/ticket/all?max="+dataMax,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    const token = res.data.info.token;
                    useToken.set(token)
                    getTicketLog(token)
                }else{
                    setLogdata(res.data)
                }
            }
            toggleFetching(false);
        })
    }

    return(
        <Forbidden authority="log_watcher">
            <LogTicketTable logData={logData} isFetching={isFetching}/>
        </Forbidden>
    )
}