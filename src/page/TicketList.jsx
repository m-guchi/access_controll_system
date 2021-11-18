import React, { useState, useEffect, useContext }  from 'react';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import LogTicketTable from '../grid/ticketList/Table';
import ReloadButton from '../atoms/ReloadButton';

export default function TicketListPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)

    const [logData, setLogdata] = useState(null);
    const [isFetching, toggleFetching] = useState(true);
    const [isError, toggleIsError] = useState(false);

    useEffect(() => {
        fetchTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const fetchTicket = () => {
        getTicketLog(contextToken.token);
    }

    const getTicketLog = (token) => {
        toggleFetching(true);
        toggleIsError(false);
        customAxios.get("/ticket/all/?num="+contextInfo.data.setting.log_ticket_fetch_max.value ,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setLogdata(res.data.data.tickets);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getTicketLog(res.data.token);
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
        <Forbidden authority="log_watcher">
            <ReloadButton onClick={fetchTicket}/>
            <LogTicketTable
                logData={logData}
                isFetching={isFetching}
            />
        </Forbidden>
    )
}