import React, { useState, useEffect, useContext } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { customAxios } from '../../templete/Axios'
import { infoContext } from '../../context/info';
import ReloadButton from '../../atoms/ReloadButton';
import PaperWrap from '../../templete/Paper';



export default function NumLineChart (props) {

    const [historyData, setHistoryData] = useState(null)
    const infoData = useContext(infoContext);

    useEffect(() => {
        getUserHistory(props.token)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const getUserHistory = (token) => {
        customAxios.get("/area/visitor",{
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    getUserHistory(res.data.info.token);
                }else{
                    setHistoryData(res.data);
                }
            }
        })
    }

    return (
        <PaperWrap>
            {infoData && infoData.area &&
            <ResponsiveContainer width="95%" minWidth={400} height={400}>
                <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time"/>
                    <YAxis/>
                    <Tooltip />
                    <Legend />
                    {
                        Object.keys(infoData.area).map((index,key) => {
                            const val = infoData.area[index]
                            if(val.hide_chart){return null}
                            return <Line
                                key={index}
                                type="monotone"
                                dataKey={val.area_id}
                                stroke={val.color_code}
                                name={val.area_name}
                                dot={false}
                            />
                        })
                    }
                </LineChart>
            </ResponsiveContainer>
            }
            <ReloadButton onClick={()=>getUserHistory(props.token)} />
        </PaperWrap>
    )
}