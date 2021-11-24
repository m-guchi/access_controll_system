import React, { useState, useContext }  from 'react';
import { Grid ,Typography, Button, TextField } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import { AlertBarContext } from '../context/AlertBarContext';
import { customAxios } from '../templete/Axios';
import Forbidden from '../templete/Forbidden';
import DeleteBox from '../grid/deleteData/DeleteBox'


export default function DeleteDataPage (props) {
    const contextToken = useContext(tokenContext);
    const contextInfo = useContext(infoContext);
    const contextAlertBar = useContext(AlertBarContext);




    const deleteUserData = (token, date) => {
        customAxios.delete("/user/old/",{
            data: {day:date},
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===204){
                contextAlertBar.setSuccess(date+"ユーザー情報を削除しました");
            }else if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.error.type==="need_this_token"){
                    deleteUserData(res.data.token, date);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
            }
        })
    }
    const deletePassData = (token, date) => {
        customAxios.delete("/user/pass/old/",{
            data: {day:date},
            headers: {"token": token}
        })
        .then(res => {
            if(res.status===204){
                contextAlertBar.setSuccess(date+"通過情報を削除しました");
            }else if(res.status<=401){
                if(res.data.token) contextToken.set(res.data.token);
                if(res.data.error.type==="need_this_token"){
                    deletePassData(res.data.token, date);
                }else{
                    contextAlertBar.setOtherError(res.data.error);
                }
            }else{
                contextAlertBar.setOtherError(res.data.error);
            }
        })
    }

    const handleDelete = (type, deleteDate) => {
        const token = contextToken.token;
        switch(type){
            case "user":
                deleteUserData(token, deleteDate);
                break;
            case "pass":
                deletePassData(token, deleteDate);
                break;
            case "token":
                deletePassData(token, deleteDate);
                break;
        }
    }

    

    return(
        <Forbidden authority="setting_mgmt">
            <Grid container>
                <Grid item md={4} xs={12}>
                    <DeleteBox
                        handleDelete={handleDelete}
                        type="user"
                        title="ユーザー情報削除"
                        describe={
                            <>
                                最終更新日時が指定日時より前の情報が削除されます。以下のデータに影響します。
                                <ul>
                                    <li>ユーザー一覧</li>
                                    <li>チケット管理</li>
                                </ul>
                            </>
                        }
                        deleteAlert={
                            <>
                                ユーザー情報を削除します。以下に関連するデータに影響します。
                                <ul>
                                    <li>ユーザー一覧</li>
                                    <li>チケット管理</li>
                                </ul>
                            </>
                        }
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <DeleteBox
                        handleDelete={handleDelete}
                        type="pass"
                        title="通過情報削除"
                        describe={
                            <>
                                通過日時が指定日時より前の情報が削除されます。以下のデータに影響します。
                                <ul>
                                    <li>ユーザー検索</li>
                                    <li>受付通過記録</li>
                                </ul>
                            </>
                        }
                        deleteAlert={
                            <>
                                通過情報を削除します。以下に関連するデータに影響します。
                                <ul>
                                    <li>ユーザー検索</li>
                                    <li>受付通過記録</li>
                                </ul>
                            </>
                        }
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <DeleteBox
                        handleDelete={handleDelete}
                        type="token"
                        title="ログイン情報削除"
                        describe={
                            <>
                                ログイン日時が指定日時より前の情報が削除されます。現在日時より先の日時を指定しない限り、システムに影響はありません。
                                <ul>
                                </ul>
                            </>
                        }
                        deleteAlert={
                            <>
                                ログイン情報を削除します。現在日時より先の日時を指定すると、現在ログイン中のユーザーに影響を及ぼす場合があります。
                            </>
                        }
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}