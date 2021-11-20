import React, { useState, useEffect, useContext }  from 'react';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import { AlertBarContext } from '../context/AlertBarContext';
import Forbidden from '../templete/Forbidden';
import LogGateTable from '../grid/logUserPass/Table';
import ReloadButton from '../atoms/ReloadButton';

export default function LogUserPassPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)
    const contextAlertBar = useContext(AlertBarContext)

    const [logData, setLogdata] = useState(null);
    const [isFetching, toggleFetching] = useState(true);

    useEffect(() => {
        fetchUserPass()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const getUserPassLog = (token) => {
        toggleFetching(true);
        customAxios.get("/user/pass/all?num="+contextInfo.data.setting.log_user_pass_fetch_max.value,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setLogdata(res.data.data.pass);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getUserPassLog(res.data.token);
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
    const fetchUserPass = () => {
        getUserPassLog(contextToken.token);
    }

    return(
        <Forbidden authority="users_mgmt">
            <ReloadButton onClick={fetchUserPass}/>
            <LogGateTable
                logData={logData}
                areaData={contextInfo.data.area}
                isFetching={isFetching}
            />
        </Forbidden>
    )
}