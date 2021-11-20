import React, { useState, createContext, useCallback } from 'react';

const dataFormat = {
    isOpen: false,
    type: "",
    message: ""
};

export const AlertBarContext = createContext({
    data: dataFormat,
    set: () => {},
    setWarning: () => {},
    setOtherError: () => {},
});

const useAlertBar = () => {
    const [data, setData] = useState(dataFormat);
    const set = useCallback((isOpen, type, message) => {
        const data = {
            isOpen:isOpen,
            type:type,
            message:message
        }
        setData(data)
    },[]);
    const setWarning = useCallback((message) => {
        setData({
            isOpen:true,
            type:"warning",
            message:message
        })
    },[]);
    const setOtherError = useCallback((errorData) => {
        setData({
            isOpen:true,
            type:"error",
            message:"エラーが発生しました。もう一度操作を行ってください。同じエラーが発生する場合は、一度ログアウトすると解決する場合があります。(errorType="+errorData.type+", errorMsg="+errorData.msg+")"
        })
    },[]);
    return {data, set, setWarning, setOtherError}
}

export const AlertBarProvider = (props) => {
    const alertBarContextData = useAlertBar();

    return (
        <AlertBarContext.Provider value={alertBarContextData}>
            {props.children}
        </AlertBarContext.Provider>
    )
};