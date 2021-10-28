import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, InputLabel, Input, InputAdornment, Paper, Button, Typography } from '@material-ui/core'
import ReactLoading from 'react-loading';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "5rem",
        textAlign: "center",
        display: "inline-block",
    },
    title: {
        marginBottom: "2rem",
    },
    loginBox: {
        margin: "1rem",
        padding: "2rem",
        maxWidth: "20rem",
        Width: "100vw",
    },
    submitButton:{
        marginTop: "0.5rem",
    },
    errorText: {
        marginTop: "1rem",
        flexBasis: "100%",
    }
}));

export default function LoginPage (props) {
    const classes = useStyles();

    const handleSetLoginId = (e) => props.setLoginId(e.target.value)
    const handleSetPassword = (e) => props.setPassword(e.target.value)


    return(
        <div className={classes.root}>
            <Typography variant="h4" color="primary" className={classes.title}>
                入退場管理システム
            </Typography>
            <form onSubmit={props.handleSubmitButton}>
                <Paper className={classes.loginBox} elevation={3}>
                    <FormControl fullWidth required margin="normal">
                        <InputLabel htmlFor="input-login-id">ログインID</InputLabel>
                        <Input
                            id="input-login-id"
                            type="text"
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircleIcon />
                                </InputAdornment>
                            }
                            onChange={handleSetLoginId}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="input-password">パスワード</InputLabel>
                        <Input
                            id="input-password"
                            type="password"
                            startAdornment={
                                <InputAdornment position="start">
                                    <VpnKeyIcon />
                                </InputAdornment>
                            }
                            onChange={handleSetPassword}
                        />
                    </FormControl>
                    {props.errorLogin && <Typography color="error">{props.errorLogin}</Typography>}
                    <Button
                        type="submit"
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                    >
                        {props.isSubmitLoginLoading
                        ? <ReactLoading type="bubbles" height="1.8em" width="2em" />
                        : "ログイン" }
                    </Button>
                </Paper>
            </form>
        </div>
    )
}