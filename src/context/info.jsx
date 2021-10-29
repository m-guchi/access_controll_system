import { useState, createContext, useCallback } from 'react'


export const infoContext = createContext({
    gate: null,
    area: null,
    authority: null,
    setting: null,
    attribute: null,
    set: () => {},
});

export const useInfo = () => {
    const [gate, setGate] = useState(null);
    const [area, setArea] = useState(null);
    const [authority, setAuthority] = useState(null);
    const [setting, setSetting] = useState(null);
    const [attribute, setAttribute] = useState(null);
    const set = useCallback((data) => {
        setGate(data.gate);
        setArea(data.area);
        setAuthority(data.authority);
        setSetting(data.setting);
        setAttribute(data.attribute);
    },[]);
    return {gate, area, authority, setting, attribute, set}
}