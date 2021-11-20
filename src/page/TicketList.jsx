import React, { useState, useEffect, useContext }  from 'react';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import { AlertBarContext } from '../context/AlertBarContext';
import Forbidden from '../templete/Forbidden';
import LogTicketTable from '../grid/ticketList/Table';
import ReloadButton from '../atoms/ReloadButton';
import { Typography } from '@material-ui/core';

export default function TicketListPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)
    const contextAlertBar = useContext(AlertBarContext)

    const [logData, setLogdata] = useState(null);
    const [isFetching, toggleFetching] = useState(true);

    useEffect(() => {
        fetchTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const getTicketLog = (token) => {
        toggleFetching(true);
        customAxios.get("/ticket/all/?num="+contextInfo.data.setting.log_ticket_fetch_max.value ,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setLogdata(res.data.data.tickets);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getTicketLog(res.data.token);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                    toggleFetching(false);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleFetching(false);
            }
        })
    }
    const fetchTicket = () => {
        getTicketLog(contextToken.token);
    }

    const putTicketData = (token, data) => {
        toggleFetching(true);
        customAxios.put("/ticket/", data, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    fetchTicket();
                    contextAlertBar.setSuccess("ユーザーIDを変更しました");
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    putTicketData(res.data.token, data);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                    toggleFetching(false);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
                toggleFetching(false);
            }
        })
    }
    const handlePutTicket = (ticket_id, user_id) => {
        if(user_id===null || user_id.length<=32){
            const data = {
                ticket_id: ticket_id,
                user_id: user_id
            };
            putTicketData(contextToken.token, data);
        }else{
            contextAlertBar.setWarning("ユーザーIDは32文字以下にしてください");
        }
    }

    return(
        <Forbidden authority="users_mgmt">
            <ReloadButton onClick={fetchTicket}/>
            <Typography variant="body2" color="secondary">ユーザーIDはダブルクリックで変更可能(0-32文字)</Typography>
            <LogTicketTable
                logData={logData}
                isFetching={isFetching}
                handlePutTicket={handlePutTicket}
            />
        </Forbidden>
    )
}