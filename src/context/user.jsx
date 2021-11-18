import { useState, createContext, useCallback } from 'react'

const dataFormat = {
    login_user_id: null,
    login_id: null,
    login_user_name: null,
    auth_group: null,
    auth: [],
    gate_id_list: [],
};

export const userContext = createContext({
    data: dataFormat,
    set: () => {}
});

export const useUser= () => {
    const [data, setData] = useState(dataFormat);
    const set = useCallback((data) => {
        setData(data);
    },[]);
    return {data, set}
}