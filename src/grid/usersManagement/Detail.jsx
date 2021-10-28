import React, { useState, useEffect, useContext } from 'react'
import { Typography, Table, TableBody } from '@material-ui/core';
import PaperWrap from '../../templete/Paper';
import { customAxios } from '../../templete/Axios';
import { userContext } from '../../context/user';
import UsersDetailInputItem from './DetailInputItem';
import UsersDetailSelectItem from './DetailSelectItem';
import UsersDetailSelectMultiItem from './DetailSelectMultiItem';

export default function UsersDetail (props) {

    const [errorMsg, setErrorMsg] = useState(null);
    const userData = props.userData;
    
    const defaultData = {
        user_id: userData.user_id,
        login_id: userData.login_id,
        user_name: userData.user_name,
        password: null,
        authority_group: userData.authority_group,
    }

    useEffect(() => {
        setErrorMsg(null);
    },[userData])

    const useUser = useContext(userContext)
    const isEditUserMyself = () => {
        if(userData && useUser){
            return userData.user_id===useUser.data.user_id
        }else{
            return false;
        }
    }

    const putAxios = (url, data, token) => {
        return customAxios({
            method: "patch",
            url: url,
            data: data,
            headers: {"token": token}
        })
    }

    const putUserData = (path, data, token) => {
        putAxios(path, data, token)
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    putUserData(path, data, res.data.info.token)
                }else{
                    props.setSelectUserData(res.data);
                    setErrorMsg(null);
                    props.getUserListData();
                }
            }else if(res.status===400){
                if(res.data.error.type==="already_login_id"){
                    setErrorMsg("このユーザーIDは既に使用されています");
                }else if(res.data.error.type==="cannot_change_myself"){
                    setErrorMsg("自分の権限は変更できません");
                }
            }else{
                setErrorMsg("エラーが発生しました");
            }
        })
    }

    const placeAxios = (method, gate_id, token) => {
        return customAxios({
            method: method,
            url: "/user/place",
            data: {
                user_id: userData.user_id,
                gate_id: gate_id,
            },
            headers: {"token": token}
        })
        
    }

    const placeData = (method, gate_id, token) => {
        placeAxios(method, gate_id, token)
        .then(res => {
            if(res.status===200){
                if(res.data.info && res.data.info.token){
                    placeAxios(method, gate_id, res.data.info.token)
                }else if(method==="post"){
                    let gateIdArray = userData.place.concat();
                    gateIdArray.push(gate_id)
                    props.setSelectUserData({...userData, place:gateIdArray});
                    setErrorMsg(null);
                }
            }else if(method==="delete" && res.status===204){
                const gateIdArray = userData.place.filter(v => v !== gate_id);
                props.setSelectUserData({...userData, place:gateIdArray});
                setErrorMsg(null);
            }else{
                setErrorMsg("エラーが発生しました");
            }
        })
    }

    const handleLoginId = (text) => {
        if(text===""){
            setErrorMsg("ユーザーIDは空白にできません");
        }else{
            const reqData = {
                ...defaultData,
                login_id: text,
            }
            putUserData("/user/", reqData, props.token)
        }
    }

    const handleUserName = (text) => {
        if(text===""){
            setErrorMsg("表示名は空白にできません");
        }else{
            const reqData = {
                ...defaultData,
                user_name: text,
            }
            putUserData("/user/", reqData, props.token)
        }
    }

    const handlePassword = (text) => {
        if(text===""){
            setErrorMsg("パスワードは空白にできません");
        }else{
            const reqData = {
                ...defaultData,
                password: text,
            }
            putUserData("/user/password", reqData, props.token)
        }
    }

    const handleAuthority = (item) => {
        const reqData = {
            ...defaultData,
            authority_group: item,
        }
        putUserData("/user/authority", reqData, props.token)
    }

    const handlePostItem = (item) => {
        placeData("post", item, props.token);
    }

    const handleDeleteItem = (item) => {
        placeData("delete", item, props.token);
    }


    return(
        <PaperWrap>
            <Typography variant='body2' color="error">{errorMsg}</Typography>
            <Table>
                <TableBody>
                    <UsersDetailInputItem
                        name="ユーザーID"
                        value={userData.user_id}
                        isDisable
                    />
                    <UsersDetailInputItem
                        name="ログインID"
                        value={userData.login_id}
                        saveEdit={handleLoginId}
                    />
                    <UsersDetailInputItem
                        name="表示名"
                        value={userData.user_name}
                        saveEdit={handleUserName}
                    />
                    <UsersDetailInputItem
                        name="パスワード(非表示)"
                        value=""
                        saveEdit={handlePassword}
                    />
                    <UsersDetailSelectItem
                        name="権限グループ"
                        value={userData.authority_group}
                        saveItem={handleAuthority}
                        canEdit={!isEditUserMyself()}
                    />
                    <UsersDetailSelectMultiItem
                        name="使用場所"
                        value={userData.place}
                        gateList={props.gateData}
                        postItem={handlePostItem}
                        deleteItem={handleDeleteItem}
                    />
                </TableBody>
            </Table>
        </PaperWrap>
    )
}