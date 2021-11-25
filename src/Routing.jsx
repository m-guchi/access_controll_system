import React, { createContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './header/Header';
import AlertBar from './atoms/AlertBar';
import SetContext from './context/SetContext';
import DashboardPage from './page/Dashboard';
import QrScanPage from './page/QrScan';
import UserCountPage from './page/UserCount';
import UserListPage from './page/UserList';
import UserSearchPage from './page/UserSearch';
import TicketListPage from './page/TicketList';
import LoginUserMgmtPage from './page/LoginUserMgmt';
import AuthMgmtPage from './page/AuthMgmt';
import SettingGatePage from './page/SettingGate';
import SettingAreaPage from './page/SettingArea';
import SettingAttributePage from './page/SettingAttribute';
import LogUserPassPage from './page/LogUserPass';
import SettingPage from './page/Setting';
import DeleteDataPage from './page/DeleteData';

const useStyles = makeStyles((theme) => ({
    main: {
        margin: theme.spacing(1),
    },
}));

export default function Routing () {
    const classes = useStyles();

    return(
        <Router basename={process.env.REACT_APP_BASE_URL}>
            <SetContext>
                <Header>
                    <article className={classes.main}>
                        <Route exact path="/"/>
                        <Route path="/dashboard" component={DashboardPage}/>
                        <Route path="/qr_scan" component={QrScanPage}/>
                        <Route path="/user_count" component={UserCountPage}/>
                        <Route path="/user_list" component={UserListPage}/>
                        <Route path="/user_search" component={UserSearchPage}/>
                        <Route path="/log_user_pass" component={LogUserPassPage}/>
                        <Route path="/ticket_list" component={TicketListPage}/>
                        <Route path="/user_mgmt" component={LoginUserMgmtPage}/>
                        <Route path="/auth_mgmt" component={AuthMgmtPage}/>
                        <Route path="/setting_gate" component={SettingGatePage}/>
                        <Route path="/setting_area" component={SettingAreaPage}/>
                        <Route path="/setting_attribute" component={SettingAttributePage}/>
                        <Route path="/setting" component={SettingPage}/>
                        <Route path="/delete_data" component={DeleteDataPage}/>
                    </article>
                    <AlertBar/>
                </Header>
            </SetContext>
        </Router>
    )
}