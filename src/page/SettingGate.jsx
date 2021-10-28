import React, { useState, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import GateTable from '../grid/settingGate/Table';
import UpdateGateInfo from '../grid/settingGate/Update'
import Forbidden from '../templete/Forbidden';

export default function SettingGatePage (props) {
    const useToken = useContext(tokenContext)
    const useInfo = useContext(infoContext)

    const [inputData, setInputData] = useState({
        gateId: null,
        gateName: null,
        outArea: "P000",
        inArea: "P000",
        isTicket: false,
        isExist: false,
    })

    return(
        <Forbidden authority="setting_management">
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <GateTable
                        infoData={useInfo}
                        setInputData={setInputData}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <UpdateGateInfo
                        token={useToken.token}
                        infoData={useInfo}
                        inputData={inputData}
                        setInputData={setInputData}
                    />
                </Grid>
            </Grid>
        </Forbidden>
    )
}