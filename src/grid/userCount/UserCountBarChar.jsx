import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PaperWrap from '../../templete/Paper';
import { infoContext } from '../../context/info';


export default function UserCountBarChar (props) {
    const contextInfo = useContext(infoContext)

    const data = (!props.userCount) ? [] : Object.keys(contextInfo.data.area).map(index => {
        const val = contextInfo.data.area[index];
        const count = props.userCount[index];
        val["count"] = count;
        return val;
    }).filter(val => !Boolean(Number(val.hide)))

    return (
        <PaperWrap>
            <div style={{width:"80%", height:"400px"}}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="area_name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="capacity" name="定員" barSize={2} stackId="capacity" fill="#888"/>
                        <Bar dataKey="count.total" name="合計" barSize={30} stackId="total" fill="#3F51B5" />
                        {Object.keys(contextInfo.data.attribute).map(att => {
                            const attData = contextInfo.data.attribute[att]
                            return <Bar dataKey={"count.attribute."+att} name={attData.attribute_name}  barSize={10} stackId="attribute" fill={attData.color} />
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </PaperWrap>
    );
}
