import React, { useState, useContext } from 'react'
import { customAxios } from '../../templete/Axios';
import { Typography, Table, TableBody, TableRow, TableCell, IconButton, Grid } from '@material-ui/core';
import { FormControlLabel, Checkbox, FormGroup, TextField } from '@material-ui/core';
import { Save as SaveIcon } from '@material-ui/icons';
import PaperWrap from '../../templete/Paper';
import { userContext } from '../../context/user';
import { tokenContext } from '../../context/token';
// import UsersDetailInputItem from './DetailInputItem';
// import UsersDetailSelectItem from './DetailSelectItem';
// import UsersDetailSelectMultiItem from './DetailSelectMultiItem';

export default function AuthorityDetail (props) {

    const [errorMsg, setErrorMsg] = useState(null);
    const useUser = useContext(userContext);
    const useToken = useContext(tokenContext);

    const handleAuthorityGroup = (group,name,check) => {
        const requestBody = {
            group: group,
            name: name
        };
        if(check){
            postAuthority(useUser.token, requestBody);
        }else{
            deleteAuthority(useUser.token, requestBody);
            customAxios.delete("/authority/", {
                data: requestBody,
                headers: {"token": useToken.token}
            })
        }
    }

    const postAuthority = (token, requestBody) => {
        customAxios.post("/authority/", requestBody, {
            headers: {"token": token}
        })
        .then(res => {
            if(res.data.info && res.data.info.token){
                const token = res.data.info.token;
                useToken.set(token);
                postAuthority(token, requestBody)
            }else{
                if(res.status!==200){
                    setErrorMsg("データ送信時にエラーが発生しました")
                }else{
                    const updateData = props.authorityData;
                    updateData["group"].push(requestBody.group);
                    props.setSelectData(updateData);
                    props.getAuthorityListData();
                }
            }
        })
    }

    const deleteAuthority = (token, requestBody) => {
        customAxios.delete("/authority/", {
            data: requestBody,
            headers: {"token": token}
        })
        .then(res => {
            if(res.data.info && res.data.info.token){
                const token = res.data.info.token;
                useToken.set(token);
                deleteAuthority(token, requestBody)
            }else{
                if(res.status!==204){
                    setErrorMsg("データ送信時にエラーが発生しました")
                }else{
                    const updateData = props.authorityData;
                    updateData["group"] = updateData["group"].filter(n => n !== requestBody.group);
                    props.setSelectData(updateData);
                    props.getAuthorityListData();
                }
            }
        })
    }

    const [newGroup, setNewGroup] = useState("");
    const handleNewGroup = (e) => setNewGroup(e.target.value);
    const handleSubmitNewGroup = (authorityName) => {
        if(newGroup){
            postAuthority(useUser.token, {
                group: newGroup,
                name: authorityName
            });
            setNewGroup("");
        }
    }

    console.log(newGroup);

    const authorityData = props.authorityData;

    if(!props.authorityData) return null;
    return(
        <PaperWrap>
            {
                errorMsg &&
                <Typography variant='body2' color="error">{errorMsg}</Typography>
            }
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>権限名</TableCell>
                        <TableCell colSpan={2}>{authorityData.authority_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>説明</TableCell>
                        <TableCell colSpan={2}>{authorityData.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>権限グループ</TableCell>
                        <TableCell colSpan={2}>
                            <FormGroup>
                                {
                                    props.authorityAllData.map((val) => {
                                        const checked = authorityData.group.includes(val);
                                        const disabled = (authorityData.authority_name==="users_management"&&useUser.data.authority_group===val);
                                        return (
                                            <FormControlLabel
                                                control={<Checkbox
                                                    disabled={disabled}
                                                    checked={checked}
                                                    name={val}
                                                    onChange={()=>handleAuthorityGroup(
                                                        val, authorityData.authority_name, !checked
                                                    )}
                                                />}
                                                label={val}
                                            />
                                        )
                                    })
                                }
                                <Grid container>
                                    <Grid item xs={9}><TextField
                                        size="small"
                                        label="新規作成"
                                        value={newGroup}
                                        onChange={handleNewGroup}
                                    /></Grid>
                                    <Grid item xs={3}><IconButton onClick={()=>handleSubmitNewGroup(authorityData.authority_name)}>
                                        <SaveIcon fontSize="small" color="primary" />
                                    </IconButton></Grid>
                                </Grid>
                            </FormGroup>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </PaperWrap>
    )
}