import React, { useState, useEffect, useContext } from 'react'
import { useInfo, infoContext } from './info';
import { useUser, userContext } from './user';
import { tokenContext } from './token';
import { customAxios } from '../templete/Axios';



export default function SetContext (props) {
    const [isLoaded, setIsLoaded] = useState(false);

    const infoData = useInfo();
    const userData = useUser();
    const useToken = useContext(tokenContext);

    useEffect(() => {
        getInfoData();
        getUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[useToken.token])

    const getInfoData = () => {
        Promise.all([
            customAxios.get("/gate/info",{
                headers: {"token": useToken.token}
            }),
            customAxios.get("/area/info",{
                headers: {"token": useToken.token}
            }),
            customAxios.get("/user/authority",{
                headers: {"token": useToken.token}
            }),
            customAxios.get("/setting/",{
                headers: {"token": useToken.token}
            }),
            customAxios.get("/visitor/attribute/",{
                headers: {"token": useToken.token}
            }),
        ])
        .then(([gateRes, areaRes, authRes, settRes, attRes]) => {
            if(gateRes.status===200 && areaRes.status===200 && authRes.status===200 && settRes.status===200 && attRes.status===200){
                infoData.set({
                    gate:gateRes.data,
                    area:areaRes.data,
                    authority:authRes.data,
                    setting:settRes.data,
                    attribute:attRes.data,
                });
                setIsLoaded(true);
            }
        })
    }

    const getUserData = () => {
        customAxios.get("/user/",{
            headers: {"token": useToken.token}
        })
        .then(res => {
            if(res.status===200){
                userData.set(res.data);
            }
        })
    }

    if(!isLoaded) return null;

    return (
        <infoContext.Provider value={infoData}>
            <userContext.Provider value={userData}>
                {props.children}
            </userContext.Provider>
        </infoContext.Provider>
    )
}