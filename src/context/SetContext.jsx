import React, { useEffect, useContext } from 'react'
import { useInfo, infoContext } from './info';
import { useUser, userContext } from './user';
import { tokenContext } from './token';
import { customAxios } from '../templete/Axios';



export default function SetContext (props) {

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
        ])
        .then(([gateRes, areaRes, authRes]) => {
            if(gateRes.status===200 && areaRes.status===200 && authRes.status===200){
                infoData.set({
                    gate:gateRes.data,
                    area:areaRes.data,
                    authority:authRes.data,
                });
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

    return (
        <infoContext.Provider value={infoData}>
            <userContext.Provider value={userData}>
                {props.children}
            </userContext.Provider>
        </infoContext.Provider>
    )
}