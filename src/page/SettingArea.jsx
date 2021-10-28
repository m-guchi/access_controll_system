import React, { useState, useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import { infoContext } from '../context/info';
import AreaTable from '../grid/settingArea/Table';
import UpdateAreaInfo from '../grid/settingArea/Update'
import Forbidden from '../templete/Forbidden';

export default function SettingAreaPage (props) {
    const useToken = useContext(tokenContext)
    const useInfo = useContext(infoContext)

    const [inputData, setInputData] = useState({
        areaId: null,
        areaName: null,
        isExist: false,
    })

    const areaData = useInfo ? useInfo.area : null;

    return(
        <Forbidden authority="setting_management">
            <Grid container>
                <Grid item sm={6} xs={12}>
                    <AreaTable
                        areaData={areaData}
                        setInputData={setInputData}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <UpdateAreaInfo
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