import React, { useContext }  from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { userContext } from '../context/user';

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CropFreeIcon from '@material-ui/icons/CropFree';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PetsIcon from '@material-ui/icons/Pets';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import RoomIcon from '@material-ui/icons/Room';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';

const all = [
    {"key":"dashboard","text":"ダッシュボード","icon":<DashboardIcon />},
];
const qrScan = [
    {"key":"qr_scan","text":"QRコードスキャン","icon":<CropFreeIcon />},
];
const visitorsCount = [
    {"key":"visitors_count","text":"会場内人数","icon":<PetsIcon />},
    {"key":"visitors_count_history","text":"会場内人数推移","icon":<ShowChartIcon />},
    {"key":"gate_count","text":"受付通過人数","icon":<DirectionsRunIcon />},
];
const visitorsManagement = [
    {"key":"visitors_management","text":"参加者一覧","icon":<SupervisorAccountIcon />},
];
const usersManagement = [
    {"key":"users_management","text":"ユーザー一覧","icon":<PeopleAltIcon />},
];
const settingManagement = [
    {"key":"setting_gate","text":"受付設定","icon":<RoomServiceIcon />},
    {"key":"setting_area","text":"エリア設定","icon":<RoomIcon />},
]
const logWatcher = [
    {"key":"log_gate","text":"受付通過ログ","icon":<HowToVoteIcon />},
    {"key":"log_ticket","text":"入場券発行ログ","icon":<ConfirmationNumberIcon />},
]

const authorityList = [
    {"list":qrScan, "authority":"qr_scan"},
    {"list":visitorsCount, "authority":"visitors_count"},
    {"list":visitorsManagement, "authority":"visitors_management"},
    {"list":usersManagement, "authority":"users_management"},
    {"list":settingManagement, "authority":"setting_management"},
    {"list":logWatcher, "authority":"log_watcher"},
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
    const authority = userData.data.authority;

    const clickPage = () => props.toggleOpen(false);

    if(!authority) return null;
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
                if(!authority.includes(item.authority)) return null;
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