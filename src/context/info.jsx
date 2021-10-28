import { useState, createContext, useCallback } from 'react'


export const infoContext = createContext({
    gate: null,
    area: null,
    authority: null,
    set: () => {},
});

export const useInfo = () => {
    const [gate, setGate] = useState(null);
    const [area, setArea] = useState(null);
    const [authority, setAuthority] = useState(null);
    const set = useCallback((data) => {
        setGate(data.gate);
        setArea(data.area);
        setAuthority(data.authority);
    },[]);
    return {gate, area, authority, set}
}