import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, IconButton, Divider, Typography } from '@material-ui/core';
import { userContext } from '../context/user';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DrawerList from './DrawerList';



const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'space-between',
    },
    drawerText: {
        marginLeft: theme.spacing(2)
    }
}));

export default function HeaderDrawer (props) {
    const classes = useStyles();

    const userData = useContext(userContext);

    const handleDrawerClose = () => {
        props.toggleOpen(false);
    }

    return(
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={props.open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <Typography className={classes.drawerText}>{userData.data.login_user_name}</Typography>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <DrawerList
                toggleOpen={props.toggleOpen}
            />
        </Drawer>
    )
}