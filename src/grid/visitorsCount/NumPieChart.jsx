import React from 'react'
import { PieChart, Pie, Text } from 'recharts';
import { makeStyles } from '@material-ui/core/styles'
import PaperWrap from '../../templete/Paper';

const useStyles = makeStyles((theme) => ({
    chart: {
        margin: "0 auto",
    },
}));

export default function NumPieChart (props) {
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
        row["sum_count"] = row.count.sum;
        row["x_count"] = row.count.x;
        row["y_count"] = row.count.y;
        row["z_count"] = row.count.z;
        return row;
    })

    if(!chartData || !label) return null;
    return(
        <PaperWrap>
            <PieChart width={350} height={300} className={classes.chart}>
                <Pie
                    data={chartData}
                    dataKey="sum_count"
                    nameKey="area_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#3F51B5"
                    labelLine={false}
                    label={label}
                />
            </PieChart>
        </PaperWrap>
    )
}