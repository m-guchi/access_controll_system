import React, { useContext }  from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { userContext } from '../context/user';

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CropFreeIcon from '@material-ui/icons/CropFree';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PetsIcon from '@material-ui/icons/Pets';
import RoomIcon from '@material-ui/icons/Room';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';

const all = [
    {"key":"dashboard","text":"ダッシュボード","icon":<DashboardIcon />},
    {"key":"qr_scan","text":"コードスキャン","icon":<CropFreeIcon />},
    {"key":"user_count","text":"会場内人数","icon":<PetsIcon />},
    {"key":"gate_count","text":"受付通過人数","icon":<DirectionsRunIcon />},
];
const userMgmt = [
    {"key":"user_list","text":"ユーザー一覧","icon":<SupervisorAccountIcon />},
    {"key":"ticket_list","text":"チケット管理","icon":<ConfirmationNumberIcon />},
    {"key":"log_user_pass","text":"受付通過記録","icon":<HowToVoteIcon />},
];
const loginUserMgmt = [
    {"key":"user_mgmt","text":"ログインユーザー","icon":<PeopleAltIcon />},
    {"key":"auth_mgmt","text":"権限グループ","icon":<FingerprintIcon />},
];
const settingMgmt = [
    {"key":"setting_gate","text":"受付設定","icon":<RoomServiceIcon />},
    {"key":"setting_area","text":"エリア設定","icon":<RoomIcon />},
]

const authorityList = [
    {"list":userMgmt, "auth":"users_mgmt"},
    {"list":loginUserMgmt, "auth":"login_users_mgmt"},
    {"list":settingMgmt, "auth":"setting_mgmt"},
]

const useStyles = makeStyles((theme) => ({
    link: {
        color: theme.palette.text.primary,
        textDecoration: "none"
    },
}));

export default function DrawerList (props) {
    const classes = useStyles();
    const userData = useContext(userContext)
    const auth = userData.data.auth;

    const clickPage = () => props.toggleOpen(false);

    if(!auth) return null;
    return(
        <>
            <List>
            {all.map((val) => (
                <Link key={val.key} to={"/"+val.key} className={classes.link} >
                    <ListItem dense button onClick={clickPage}>
                        <ListItemIcon>{val.icon}</ListItemIcon>
                        <ListItemText primary={val.text} />
                    </ListItem>
                </Link>
            ))}
            </List>
            {authorityList.map((item,key) => {
                if(!auth.includes(item.auth)) return null;
                return (<>
                    <Divider />
                    <List key={key}>
                    {(item.list).map((val) => (
                        <Link key={val.key} to={"/"+val.key} className={classes.link} >
                            <ListItem dense button onClick={clickPage}>
                                <ListItemIcon>{val.icon}</ListItemIcon>
                                <ListItemText primary={val.text} />
                            </ListItem>
                        </Link>
                    ))}
                    </List>
                </>)
            })}
        </>
    )
}