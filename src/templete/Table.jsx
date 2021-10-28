import React from 'react'
import { Table, TableHead, TableCell, TableRow, TableBody, Button } from '@material-ui/core';
import PaperWrap from '../grid/Paper';
import CachedIcon from '@material-ui/icons/Cached';

export default function UsersTable (props) {

    const setSelectUserData = (userData) => {
        props.setSelectUserData(userData);
    }

    const usersData = props.usersData;

    return(
        <PaperWrap>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">ログインID</TableCell>
                        <TableCell align="center">表示名</TableCell>
                        <TableCell align="center">権限グループ</TableCell>
                        <TableCell align="center">使用場所</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {(usersData && props.gateData) && usersData.map((row) => {
                    return( <TableRow key={row.user_id}>
                                <TableCell align="center">{row.login_id}</TableCell>
                                <TableCell align="center">{row.user_name}</TableCell>
                                <TableCell align="center">{row.authority_group}</TableCell>
                                <TableCell align="center">
                                    {row.place && row.place.map((str) => {
                                        return <React.Fragment>{props.gateData[str].gate_name} / </React.Fragment>
                                    })}
                                </TableCell>
                                <TableCell align="right"><Button color="primary" onClick={() => setSelectUserData(row)}>詳細</Button></TableCell>
                            </TableRow> )
                })}
                </TableBody>
            </Table>
            <Button color="primary" onClick={props.getUserListData} startIcon={<CachedIcon />}>更新</Button>
        </PaperWrap>
    )
}