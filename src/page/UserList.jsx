import React, { useState, useEffect, useContext }  from 'react';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { customAxios } from '../templete/Axios';
import { AlertBarContext } from '../context/AlertBarContext';
import VisitorsTable from '../grid/userList/Table';
import Forbidden from '../templete/Forbidden';
import ReloadButton from '../atoms/ReloadButton';


export default function UserListPage (props) {
    const contextToken = useContext(tokenContext)
    const contextInfo = useContext(infoContext)
    const contextAlertBar = useContext(AlertBarContext)

    const [userAllData, setUserAllData] = useState(null)
    const [userData, setUserData] = useState(null);
    const [isFetching, toggleFetching] = useState(true);

    const [isAllUser, setIsAllUser] = useState(false);
    const handleChangeAllUser = () => {
        setIsAllUser(!isAllUser);
    }

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hideAreaArr = !contextInfo ? [] : Object.keys(contextInfo.data.area).filter(index => {
        const areaData = contextInfo.data.area[index];
        return Boolean(Number(areaData.hide))
    });
    useEffect(() => {
        if(userAllData){
            if(isAllUser){
                setUserData(userAllData)
            }else{
                const userData = Object.keys(userAllData).reduce((acc,index) => {
                    const user = userAllData[index];
                    if(!hideAreaArr.includes(user.area_id)){
                        acc[index] = user;
                    }
                    return acc;
                },[])
                setUserData(userData)
            }
        }
    }, [isAllUser, userAllData])

    const getUserData = (token) => {
        toggleFetching(true);
        customAxios.get("/user/all/?num="+contextInfo.data.setting.log_user_fetch_max.value ,{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.ok){
                    setUserAllData(res.data.data.users);
                    toggleFetching(false);
                }else if(res.data.error.type==="need_this_token"){
                    getUserData(res.data.token);
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
    const fetchUser = () => {
        getUserData(contextToken.token);
    }

    return(
        <Forbidden authority="users_mgmt">
            <Grid container>
                <Grid item xs={12}>
                    <ReloadButton onClick={fetchUser}/><br/>
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={isAllUser} onChange={handleChangeAllUser} name="allUser" />}
                        label="すべてのユーザーを表示する"
                    />
                    <VisitorsTable
                        infoData={contextInfo.data}
                        userData={userData}
                        handleReloadUserData={fetchUser}
                        isFetching={isFetching}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}