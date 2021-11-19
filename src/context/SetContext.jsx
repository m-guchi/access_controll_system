import React, { useState, useEffect, useContext } from 'react'
import { useInfo, infoContext } from './info';
import { useUser, userContext } from './user';
import { tokenContext } from './token';
import { customAxios } from '../templete/Axios';

export default function SetContext (props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const infoContextData = useInfo();
    const userContextData = useUser();
    const contextToken = useContext(tokenContext);

    useEffect(() => {
        setIsLoaded(false);
        getInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[contextToken.token])

    const getInitialData = () => {
        Promise.all([
            fetchSettingData(contextToken.token),
            fetchUserData(contextToken.token)
        ])
        .then(([resInfo, resUser]) => {
            if(resInfo.status<=401 && resUser.status<=401){
                setIsError(false);
                let renewToken = null;
                if(resInfo.data.token){
                    renewToken = resInfo.data.token
                    contextToken.set(renewToken);
                }else if(resUser.data.token){
                    renewToken = resUser.data.token
                    contextToken.set(renewToken);
                }
                if(renewToken && (
                    (!resInfo.data.ok && resInfo.data.error.type==="need_this_token")
                || (!resUser.data.ok && resUser.data.error.type==="need_this_token")
                )){
                    Promise.all([
                        fetchSettingData(resInfo.data.token),
                        fetchUserData(resInfo.data.token)
                    ])
                    .then(([resInfo, resUser]) => {
                        setContextData(resInfo, resUser);
                    })
                }else{
                    setContextData(resInfo, resUser);
                }
            }else{
                setIsError(true);
                setIsLoaded(true);
            }
        })
    }

    const setContextData = (resInfo, resUser) => {
        if(resInfo.status===200 && resInfo.data.ok && resUser.status===200 && resUser.data.ok){
            const infoData = resInfo.data.data;
            const userData = resUser.data.data;
            userData["auth"] = (userData.auth_group in infoData.auth_group) ? infoData.auth_group[userData.auth_group] : [];
            infoContextData.set(infoData);
            userContextData.set(userData);
        }else{
            setIsError(true);
        }
        setIsLoaded(true);
    }

    const fetchSettingData = (token) => {
        return customAxios.get("/setting/",{
            headers: {"token": token}
        })
    }

    const fetchUserData = (token) => {
        return customAxios.get("/login/user/",{
            headers: {"token": token}
        })
    }


    if(!isLoaded) return null;
    if(isError) return <div>データ取得時にエラーが発生しました。ページを更新してください。</div>;

    return (
        <infoContext.Provider value={infoContextData}>
            <userContext.Provider value={userContextData}>
                {props.children}
            </userContext.Provider>
        </infoContext.Provider>
    )
}