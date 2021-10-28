import React, { useState, useEffect, useContext }  from 'react';
import { tokenContext } from '../context/token';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import LogTicketTable from '../grid/logTicket/Table';

const intervalTime = 60000;

export default function LogTicketPage (props) {
    const tokenData = useContext(tokenContext)

    const [logData, setLogdata] = useState(null);
    const [isFetching, toggleFetching] = useState(true);

    useEffect(() => {
        getTicketLog(tokenData.token);
        const interval = setInterval(() => {
            getTicketLog(tokenData.token);
        }, intervalTime);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const dataMax = 10000;

    

    const getTicketLog = (token) => {
        toggleFetching(true);
        customAxios.get("/visitor/ticket/all?max="+dataMax,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    getTicketLog(res.data.info.token)
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