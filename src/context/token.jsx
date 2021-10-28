import { useState, createContext, useCallback } from 'react'

export const tokenContext = createContext({
    token: null,
    set: () => {}
});

export const useToken = () => {
    const [token, setToken] = useState(null)
    const set = useCallback((current) => {
        setToken(current)
    },[]);
    return {
        token,
        set,
    }
}