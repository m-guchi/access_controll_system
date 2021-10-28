import React, { useContext }  from 'react';
import { Grid } from '@material-ui/core';
import { tokenContext } from '../context/token';
import NumLineChart from '../grid/visitorsCountHistory/LineChart';
import Forbidden from '../templete/Forbidden';

export default function VisitorsCountHistoryPage (props) {
    const useToken = useContext(tokenContext)

    return(
        <Forbidden authority="visitors_count">
            <Grid container>
                <Grid item xs={12}>
                    <NumLineChart token={useToken.token}/>
                </Grid>
            </Grid>
        </Forbidden>
    )
}