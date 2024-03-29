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
import RoomIcon from '@material-ui/icons/Room';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import SearchIcon from '@material-ui/icons/Search';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

const all = [
    {"key":"dashboard","text":"ダッシュボード","icon":<DashboardIcon />},
];
const recordUserPass = [
    {"key":"qr_scan","text":"通過情報登録","icon":<CropFreeIcon />},
]
const userMgmt = [
    {"key":"user_list","text":"ユーザー一覧","icon":<SupervisorAccountIcon />},
    {"key":"user_search","text":"ユーザー検索","icon":<SearchIcon />},
    {"key":"log_user_pass","text":"受付通過記録","icon":<HowToVoteIcon />},
    {"key":"ticket_list","text":"チケット管理","icon":<ConfirmationNumberIcon />},
];
const loginUserMgmt = [
    {"key":"user_mgmt","text":"ログインユーザー","icon":<PeopleAltIcon />},
    {"key":"auth_mgmt","text":"権限グループ","icon":<FingerprintIcon />},
];
const settingMgmt = [
    {"key":"setting_gate","text":"受付設定","icon":<RoomServiceIcon />},
    {"key":"setting_area","text":"エリア設定","icon":<RoomIcon />},
    {"key":"setting_attribute","text":"ユーザー属性設定","icon":<GroupAddIcon />},
    {"key":"setting","text":"各種設定","icon":<SettingsIcon />},
    {"key":"delete_data","text":"データ消去","icon":<DeleteSweepIcon />},
]

const authorityList = [
    {"list":recordUserPass, "auth":"record_user_pass"},
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