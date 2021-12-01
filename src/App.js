import React from 'react'
import { useToken, tokenContext } from './context/token'
import Auth from './auth/Auth'
import Routing from './Routing'
import { AlertBarProvider } from './context/AlertBarContext';


function App() {

    const tokenContextData = useToken();

    return (
        <div className="App">
            <tokenContext.Provider value={tokenContextData}>
                <AlertBarProvider>
                    <Auth>
                        <Routing/>
                    </Auth>
                </AlertBarProvider>
            </tokenContext.Provider>
        </div>
    );
}

export default App;
