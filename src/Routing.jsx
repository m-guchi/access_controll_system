import React, { createContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './header/Header'
import DashboardPage from './page/Dashboard';
import QrScanPage from './page/QrScan';
import VisitorsCountPage from './page/VisitorsCount';
import VisitorsCountHistoryPage from './page/VisitorsCountHistory';
import GateCountPage from './page/GateCount';
import UsersManagementPage from './page/UsersManagement';
import AuthorityManagementPage from './page/AuthorityManagement';
import VisitorsManagementPage from './page/VisitorsManagement';
import SettingGatePage from './page/SettingGate';
import SettingAreaPage from './page/SettingArea';
import LogGatePage from './page/LogGate';
import LogTicketPage from './page/LogTicket';

export const authorityContext = createContext();

const useStyles = makeStyles((theme) => ({
    main: {
        margin: theme.spacing(1),
    },
}));

export default function Routing () {
    const classes = useStyles();

    return(
        <Router basename={process.env.REACT_APP_BASE_URL}>
            <Header>
                <article className={classes.main}>
                    <Route exact path="/"/>
                    <Route path="/dashboard" component={DashboardPage}/>
                    <Route path="/qr_scan" component={QrScanPage}/>
                    <Route path="/visitors_count" component={VisitorsCountPage}/>
                    <Route path="/visitors_count_history" component={VisitorsCountHistoryPage}/>
                    <Route path="/gate_count" component={GateCountPage}/>
                    <Route path="/users_management" component={UsersManagementPage}/>
                    <Route path="/authority_management" component={AuthorityManagementPage}/>
                    <Route path="/visitors_management" component={VisitorsManagementPage}/>
                    <Route path="/setting_gate" component={SettingGatePage}/>
                    <Route path="/setting_area" component={SettingAreaPage}/>
                    <Route path="/log_gate" component={LogGatePage}/>
                    <Route path="/log_ticket" component={LogTicketPage}/>
                </article>
            </Header>
        </Router>
    )
}