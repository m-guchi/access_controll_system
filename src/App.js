import React from 'react'
import { useToken, tokenContext } from './context/token'
import Auth from './auth/Auth'
import Routing from './Routing'
import SetContext from './context/SetContext';



function App() {

    const token = useToken();

    return (
        <div className="App">
            <tokenContext.Provider value={token}>
                <Auth>
                    <SetContext>
                        <Routing/>
                    </SetContext>
                </Auth>
            </tokenContext.Provider>
        </div>
    );
}

export default App;
