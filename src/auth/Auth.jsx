import React, { useState, useEffect, useContext } from 'react'
import LoginPage from './LoginPage';
import { AlertBarContext } from '../context/AlertBarContext';
import { customAxios } from '../templete/Axios';
import { tokenContext } from '../context/token';


export default function Auth (props) {
    const [isLoaded, setLoaded] = useState(false);

    
    
    const [isLogin, setLogin] = useState(false);
    const [errorLogin, setErrorLogin] = useState(null);
    const [isSubmitLoginLoading, setSubmitLoginLoading] = useState(false);
    
    const [loginId, setLoginId] = useState(null);
    const [password, setPassword] = useState(null);
    
    const useToken = useContext(tokenContext);
    const contextAlertBar = useContext(AlertBarContext)

    useEffect(() => {
        fetchLogin(useToken.token)
        .then(res => {
            if(res.status===200){
                if(res.data.data.login){
                    setLogin(true);
                    setLoaded(true);
                }else{
                    if(res.data.token){
                        useToken.set(res.data.token);
                        fetchLogin(res.data.token)
                        .then(res => {
                            if(res.status===200 && res.data.data.login){
                                setLogin(true);
                                setLoaded(true);
                            }else{
                                setLoaded(true);
                            }
                        })
                    }else{
                        setLoaded(true);
                    }
                }
            }else{
                setLoaded(true);
            }
        })
        .catch(err => {
            setLoaded(true);
            contextAlertBar.setError("データベースでエラーが発生しました。(errorMsg="+err.response.data.error.message+")")
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[useToken])

    const handleSubmitButton = (e) => {
        e.preventDefault();
        postLogin();
    }

    const fetchLogin = (token) => {
        if(token){
            return customAxios.get("/login/",{
                headers: {"token": token}
            })
        }else{
            return customAxios.get("/login/")
        }
    }

    const postLogin = () => {
        setSubmitLoginLoading(true);
        customAxios.post("/login/",{
            login_id: loginId,
            password: password,
        })
        .then(res => {
            if(res.status===200 && res.data.ok){
                setErrorLogin(null);
                useToken.set(res.data.token);
                contextAlertBar.setSuccess("ログインしました")
                setLogin(true);
            }else{
                const type = res.data.error.type;
                switch(type){
                    case "not_in_user":
                        contextAlertBar.setWarning("ログインIDが異なります。")
                        break;
                    case "invalid_password":
                        contextAlertBar.setWarning("パスワードが異なります")
                        break;
                    case "invalid_param":
                        contextAlertBar.setWarning("ユーザーIDとパスワードを入力してください")
                        break;
                    default:
                        contextAlertBar.setOtherError(res.data.error)
                        break;
                }
            }
            setSubmitLoginLoading(false);
        })
    }


    return(
        isLoaded ?
            isLogin ?
            props.children :
            <LoginPage
                setLoginId={setLoginId}
                setPassword={setPassword}
                handleSubmitButton={handleSubmitButton}
                isSubmitLoginLoading={isSubmitLoginLoading}
                errorLogin={errorLogin}
            /> :
        <div></div>
    )
}