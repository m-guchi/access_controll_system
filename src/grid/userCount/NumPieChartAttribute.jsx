import React from 'react'
import { PieChart, Pie, Text } from 'recharts';
import { makeStyles } from '@material-ui/core/styles'
import PaperWrap from '../../templete/Paper';
import { Typography, Grid } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    chart: {
        margin: "0 auto",
    },
}));

export default function NumPieChartAttribute (props) {
    const classes = useStyles();
    
    const RADIAN = Math.PI / 180;
    const label = ({name, value, midAngle, innerRadius, outerRadius, cx, cy}) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN) * 0.5;
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const textAnchor = x > cx ? "start" : "end";
        const text = name + "("+value+")"
        return (
            <Text x={x} y={y} fill="#fff" textAnchor={textAnchor} dominantBaseline="central" fontSize="0.7em">
                {text}
            </Text>
        )
    }
    
    const chartData = !props.visitorsCount ? null : Object.keys(props.visitorsCount).map((index) => {
        let row = props.visitorsCount[index];
        const areaDetail = props.infoData.area[index];
        if(!areaDetail) return null;
        if(areaDetail.hide_chart) return null;
        row["name"] = areaDetail.area_name;
        return row;
    })
    
    
    const splitNum = window.innerWidth>970 ? 3 : 2;
    const attributeNum = Object.keys(props.infoData.attribute).length;
    const containerNum = Math.ceil(attributeNum/splitNum);

    if(!chartData || !label) return null;

    return(
        <PaperWrap>
        {(() => {
            const items = [];
            for (let i = 0; i <containerNum; i++) {
                items.push(
                    <Grid container>
                        {
                            Object.keys(props.infoData.attribute).map((index,key) => {
                                if(key < i*splitNum || (i+1)*splitNum-1 < key) return null;
                                const val = props.infoData.attribute[index];
                                return (
                                    <Grid item xs={12/splitNum}>
                                        <Typography>{val.name}</Typography>
                                        <PieChart width={350} height={300} className={classes.chart}>
                                            <Pie
                                                data={chartData}
                                                dataKey={val.id}
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                fill="#0F9D58"
                                                labelLine={false}
                                                label={label}
                                            />
                                        </PieChart>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                )
            }
            return items;
        })()}
        </PaperWrap>
    )
}