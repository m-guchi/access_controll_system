import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, FormControl, Input, InputAdornment, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { AlertBarContext } from '../../context/AlertBarContext';


const useStyles = makeStyles((theme) => ({
    root: {
        color: '#222'
    },
    prefixList: {
        width: 300,
        margin: "0 auto",
        marginTop: theme.spacing(1)
    }
}));

export default function PrefixBox (props) {
    const classes = useStyles();

    const contextAlertBar = useContext(AlertBarContext);

    const handleDeleteButton = (prefix) => {
        props.handleDeletePrefix(prefix)
    }

    const [registerPrefix, setRegisterPrefix] = useState("")
    const handleInputPrefix = (e) => setRegisterPrefix(e.target.value)
    const handleRegisterButton = () => {
        if(registerPrefix.length<=0){
            contextAlertBar.setWarning("プレフィックスを入力してください")
        }else if(registerPrefix.length>24){
            contextAlertBar.setWarning("プレフィックスは24文字以下にしてください")
        }else{
            props.handleRegisterPrefix(registerPrefix)
            setRegisterPrefix("")
        }
    }

    return(
        <div className={classes.root}>
            <Typography variant="h6">プレフィックス登録/削除</Typography>
            <Typography variant="body2">ユーザーIDを先頭から読んだときに以下の文字列と一致する場合、ユーザーはこの属性としてカウントされます。</Typography>
            <div>
                {
                    props.prefixList && props.prefixList.map((val,index) => {
                        return (
                            <div className={classes.prefixList}>
                                <Input
                                    id={index}
                                    value={val}
                                    disabled
                                    fullWidth
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleDeleteButton(val)} >
                                            <DeleteIcon color="secondary" />
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                            </div>
                        )
                    })
                }
                <div className={classes.prefixList}>
                    <Input
                        id="register"
                        value={registerPrefix}
                        fullWidth
                        onChange={handleInputPrefix}
                        autoFocus
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={handleRegisterButton} >
                                <AddCircleIcon color="primary" />
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </div>
            </div>
        </div>
    )
}