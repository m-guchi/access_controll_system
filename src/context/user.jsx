import { useState, createContext, useCallback } from 'react'

const dataFormat = {
    user_id: null,
    user_name: null,
    login_name: null,
    authority_group: null,
    authority: [],
    place: [],
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