import { useState, createContext, useCallback } from 'react'

const dataFormat = {
    area: [],
    gate: [],
    setting: [],
    auth_list: [],
    auth_group: [],
    attribute: [],
};

export const infoContext = createContext({
    data: dataFormat,
    set: () => {},
});

export const useInfo = () => {
    const [data, setData] = useState(dataFormat);
    const set = useCallback((data) => {
        setData(data);
    },[]);
    return {data, set}
}