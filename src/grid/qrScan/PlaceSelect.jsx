import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Select, MenuItem } from '@material-ui/core'
import { infoContext } from '../../context/info';
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

    const contextInfo = useContext(infoContext)

    const isSelectGate = Object.keys(contextInfo.data.gate).includes(props.selectedGateId);
    const selectGateData = isSelectGate ? contextInfo.data.gate[props.selectedGateId] : [];

    const SelectContent = () => {
        return(
            <Select
            displayEmpty
            value={props.selectedGateId}
            onChange={(e)=>props.setSelectGateId(e.target.value)}
            >
                {contextInfo.data.gate && Object.keys(contextInfo.data.gate).map((index) => {
                    const item = contextInfo.data.gate[index];
                    if(!Boolean(Number(contextInfo.data.setting.use_ticket.value)) && Boolean(Number(item.can_make_ticket))) return null;
                    return(
                        <MenuItem
                            key={index}
                            color={index===props.selectedGateId?"primary":"default"}
                            value={index}
                        >{item.gate_name}</MenuItem>
                    )
                })}
            </Select>
        )
    }

    const DetailContent = () => {
        if(isSelectGate){
            return(
                <div className={classes.detail}>
                    <Typography variant="subtitle1" color="primary">{selectGateData.gate_name}</Typography>
                    <Typography variant="subtitle2">
                        ( {contextInfo.data.area[selectGateData.out_area].area_name} → {contextInfo.data.area[selectGateData.in_area].area_name} )
                    </Typography>
                    {Boolean(Number(selectGateData.can_make_ticket)) && <Typography variant="subtitle2" color="secondary">チケット紐付け</Typography>}
                </div>
            )
        }else{
            return <Typography color="textSecondary" variant="subtitle1">使用場所を選択</Typography>;
        }
    }
    
    return(
        <PaperWrap>
            <DetailContent />
            <SelectContent />
        </PaperWrap>
    )
}