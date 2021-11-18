import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, IconButton } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import PaperWrap from '../../templete/Paper';
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

const columns = [
    {field: "user_id", headerName: "ユーザーID", width: 200},
    {field: "attribute_name", headerName: "属性", width: 140},
    {field: "time", headerName: "最終通過時間", width: 200},
    {field: "area_id", headerName: "エリアID", width: 150},
    {field: "area_name", headerName: "エリア名", width: 180},
]

export default function VisitorsTable (props) {

    const [searchText, setSearchText] = useState(null);
    const [rows, setRows] = useState(props.userData);

    const contextInfo = props.infoData

    useEffect(() => {
        setRows(props.userData)
    },[props.userData])

    const requestSearch = (searchValue) => {
        setSearchText(searchValue)
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = (!props.userData) ? [] :Object.keys(props.userData).filter((index) => {
            return (searchRegex.test(props.userData[index]["user_id"]))
        }).reduce((res,index) => {
            res[index] = props.userData[index];
            return res;
        },{})
        setRows(filteredRows);
    }

    const row = (!contextInfo || !rows) ? [] : Object.keys(rows).map(index => {
        const val = rows[index];
        val["id"] = val["user_id"];
        val["attribute_name"] = (val["attribute_id"] in contextInfo.attribute) ? contextInfo.attribute[val["attribute_id"]].attribute_name : null;
        val["area_name"] = (val["area_id"] in contextInfo.area) ? contextInfo.area[val["area_id"]].area_name : null;
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
                loading={props.isFetching}
                rows={row}
                columns={columns}
                rowsPerPageOptions={[100,250,500,1000]}
            />
        </PaperWrap>
    )
}