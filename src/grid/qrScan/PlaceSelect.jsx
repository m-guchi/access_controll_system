import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Select, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core'
import PaperWrap from '../../templete/Paper';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(0.5),
    },
    detail: {
        marginBottom: theme.spacing(1)
    },
    checkbox: {
        margin: theme.spacing(1),
        "& > span": {
            fontSize: "0.9rem"
        }
    }
}));

export default function QrScanPlaceSelect (props) {
    const classes = useStyles();
    
    const isAllReception = props.user.authority.includes("all_reception");
    const isTicketReception = props.user.authority.includes("ticket_reception");

    const SelectContent = () => {
        if(isAllReception){
            return(
                <Select
                    displayEmpty
                    value={props.useGateData.id}
                    onChange={(e)=>props.setGateId(e.target.value)}
                >
                    {Object.keys(props.gateList).map((index,key) => {
                        const item = props.gateList[index];
                        if(item.ticket_flag && !isTicketReception) return null;
                        return(
                            <MenuItem
                                key={key}
                                color={index===props.useGateData.id?"primary":"default"}
                                value={index}
                            >{item.gate_name}</MenuItem>
                        )
                    })}
                </Select>
            )
        }else{
            return props.user.gate_id_list.map(val => {
                if(props.gateList[val].ticket_flag && !isTicketReception) return null;
                return(
                    <Button
                        key={val}
                        color={val===props.useGateData.id?"primary":"default"}
                        variant="outlined"
                        className={classes.button}
                        onClick={()=>props.setGateId(val)}
                    >{props.gateList[val].gate_name}</Button>
                )
            })
        }
    }

    const DetailContent = () => {
        if(props.useGateData.id in props.gateList){
            const gateData = props.gateList[props.useGateData.id];
            return(
                <div className={classes.detail}>
                    <Typography>{gateData.gate_name}</Typography>
                    <Typography variant="body2">
                        {props.areaList[gateData.out_area].area_name} → {props.areaList[gateData.in_area].area_name}
                    </Typography>
                </div>
            )
        }else{
            return <Typography color="textSecondary" variant="body2">使用場所を選択</Typography>;
        }
    }

    const CheckGateWithTicket = () => {
        
        return(
            <FormControlLabel
                className={classes.checkbox}
                control={<Checkbox
                    checked={props.isGateWhenTicket}
                    onChange={()=>props.toggleGateWhenTicket(!props.isGateWhenTicket)}
                />}
                label="通過情報も同時に送信"
            />
        )
    }
    
    if(!props.user || !props.gateList || !props.areaList) return null;
    return(
        <PaperWrap>
            <DetailContent />
            <SelectContent />
            {props.useGateData && props.useGateData.ticket && <CheckGateWithTicket />}
        </PaperWrap>
    )
}