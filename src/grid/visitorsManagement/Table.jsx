import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, IconButton } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { infoContext } from '../../context/info';
import PaperWrap from '../../templete/Paper';
import ReloadButton from '../../atoms/ReloadButton';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';



function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
    },
}));

function QuickSearchToolbar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridToolbar/>
            <TextField
                variant="standard"
                className={classes.textField}
                value={props.value}
                onChange={props.onChange}
                placeholder="予約ID/入場券ID"
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                    endAdornment: (
                      <IconButton
                        title="Clear"
                        aria-label="Clear"
                        size="small"
                        onClick={props.clearSearch}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                }}
            />
        </div>
    );
}

const columns = [
    {field: "yoyaku_id", headerName: "予約ID", width: 120},
    {field: "ticket_id_dis", headerName: "入場券ID", width: 180},
    {field: "attribute_dis", headerName: "属性", width: 140},
    {field: "last_gate_dis", headerName: "最終通過受付", width: 180},
    {field: "last_area_dis", headerName: "最終到達エリア", width: 180},
    {field: "last_pass_time", headerName: "最終通過時間", width: 200},
]

export default function VisitorsTable (props) {

    const [searchText, setSearchText] = useState(null);
    const [rows, setRows] = useState(props.visitorsData);

    const useInfo = useContext(infoContext)

    useEffect(() => {
        setRows(props.visitorsData)
    },[props.visitorsData])

    const requestSearch = (searchValue) => {
        setSearchText(searchValue)
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = (!props.visitorsData) ? [] :props.visitorsData.filter((row) => {
            if(searchRegex.test(row["yoyaku_id"])) return true;
            if(searchRegex.test(row["ticket_id"])) return true;
            return false;
        });
        setRows(filteredRows);
    }

    const row = (!props.infoData || !props.infoData.gate || !props.infoData.area || !rows) ? [] : rows.map(val => {
        val["id"] = val["yoyaku_id"];
        val["ticket_id_dis"] = val["ticket_id"];
        val["attribute_dis"] = useInfo.attribute[val["attribute"]].name;
        val["last_gate_dis"] = (val["last_gate"] in props.infoData.gate) ? props.infoData.gate[val["last_gate"]].gate_name : "";
        val["last_area_dis"] = (val["last_area"] in props.infoData.area) ? props.infoData.area[val["last_area"]].area_name : "";
        return val;
    })

    return(
        <PaperWrap>
            <DataGrid
                components={{
                    Toolbar: QuickSearchToolbar,
                }}
                componentsProps={{
                    toolbar: {
                        value: searchText,
                        onChange: (e)=>requestSearch(e.target.value),
                        clearSearch: ()=>requestSearch(''),
                    },
                }}
                autoHeight
                rows={row}
                columns={columns}
            />
            <ReloadButton onClick={props.handleGetVisitorsData} />
        </PaperWrap>
    )
}