import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, IconButton } from '@material-ui/core';
import { DataGrid, GridToolbar, GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
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
                placeholder="ユーザーID"
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

function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}

const columns = [
    {field: "time", headerName: "通過時間", "width": 200, type: 'dateTime',},
    {field: "user_id", headerName: "ユーザーID", "width": 200},
    {field: "out_area", headerName: "前(エリアID)", "width": 150, hide: true},
    {field: "out_area_name", headerName: "前(エリア名)", "width": 180},
    {field: "in_area", headerName: "次(エリアID)", "width": 150, hide: true},
    {field: "in_area_name", headerName: "次(エリア名)", "width": 180},
]

export default function LogGateTable (props) {
    const [searchText, setSearchText] = useState(null);
    const [rows, setRows] = useState(props.logData);

    useEffect(() => {
        setRows(props.logData)
    },[props.logData])

    const requestSearch = (searchValue) => {
        setSearchText(searchValue)
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = (!props.logData) ? [] :props.logData.filter((val) => {
            return (searchRegex.test(val.user_id))
        })
        setRows(filteredRows);
    }

    const row = (!props.areaData || !rows) ? [] : rows.map(val => {
        val["id"] = val["time"]+val["user_id"];
        val["out_area_name"] = (val["out_area"] in props.areaData) ? props.areaData[val["out_area"]].area_name : null;
        val["in_area_name"] = (val["in_area"] in props.areaData) ? props.areaData[val["in_area"]].area_name : null;
        return val;
    })
    
    return(
        <div style={{ height: '90vh'}}>
            <DataGrid
                components={{
                    Toolbar: QuickSearchToolbar,
                    LoadingOverlay: CustomLoadingOverlay,
                }}
                componentsProps={{
                    toolbar: {
                        value: searchText,
                        onChange: (e)=>requestSearch(e.target.value),
                        clearSearch: ()=>requestSearch(''),
                    },
                }}
                loading={props.isFetching}
                rows={row}
                columns={columns}
                rowsPerPageOptions={[100,250,500,1000]}
            />
        </div>
    )
}