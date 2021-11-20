import { useState, createContext, useCallback } from 'react'

const dataFormat = {
    area: [], //area_id:{}
    gate: [], //gate_id:{}
    setting: [], //id:{id,value,description}
    auth_list: [], //{auth_name:description}
    auth_group: [], //auth_group:[auth_name]
    attribute: [], //attribute_id:{}
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