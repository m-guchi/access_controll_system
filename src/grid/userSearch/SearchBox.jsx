import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { infoContext } from '../../context/info';
import { AlertBarContext } from '../../context/AlertBarContext';


const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(2)
    },
    textBox: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    }
}));

export default function SearchBox (props) {
    const classes = useStyles();

    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);

    const [areaId, setAreaId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleAreaId = (e) => setAreaId(e.target.value);
    const handleStartDate = (e) => setStartDate(e.target.value);
    const handleEndDate = (e) => setEndDate(e.target.value);

    const handleSearchSubmit = () => {
        let errorMsg = "";
        let errorFlg = false;
        if(!areaId){
            errorMsg += "検索エリアを指定してください。"
            errorFlg = true;
        }
        if(!startDate){
            errorMsg += "開始日時を指定してください。"
            errorFlg = true;
        }
        if(!endDate){
            errorMsg += "終了日時を指定してください。"
            errorFlg = true;
        }
        if(errorFlg){
            contextAlertBar.setWarning(errorMsg);
        }else{
            const startDateFormat = new Date(startDate);
            const endDateFormat = new Date(endDate);
            if(startDateFormat >= endDateFormat){
                contextAlertBar.setWarning("開始日時は終了日時より前の日時にしてください");
            }else{
                //success
                props.handleSearchUser({
                    areaId: areaId,
                    startDate: startDate,
                    endDate: endDate,
                });
            }
        }

    }

    return(
        <div className={classes.root}>
            <div className={classes.textBox}>
            <FormControl className={classes.formControl}>
                <InputLabel id="areaId">検索エリア</InputLabel>
                <Select
                    labelId="areaId"
                    value={areaId}
                    onChange={handleAreaId}
                >
                    {Object.keys(contextInfo.data.area).map(index => {
                        const val = contextInfo.data.area[index];
                        return <MenuItem value={index}>{val.area_name}</MenuItem>
                    })}
                </Select>
            </FormControl>
                <TextField
                    label="開始日時"
                    variant="outlined"
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={startDate}
                    onChange={handleStartDate}
                />
                <TextField
                    label="終了日時"
                    variant="outlined"
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={endDate}
                    onChange={handleEndDate}
                />
            </div>
            <Button variant="contained" color="primary" onClick={handleSearchSubmit}>検索</Button>
        </div>
    )
}