import React, { useState } from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, IconButton, Link } from '@material-ui/core';
import LogoutButton from '../auth/LogoutButton'
import MenuIcon from '@material-ui/icons/Menu';
import HeaderDrawer from './Drawer';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    header: {
        backgroundColor:'#1976D2',
        color:"#fff",
        padding:'0.4rem'
    },
    title: {
        flexGrow: 1,
        "& > *": {
            color: "#fff"
        }
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    
}));

export default function Header (props) {
    const classes = useStyles();

    const [open, toggleOpen] = useState(false);

    const handleOpenDrawer = () => {
        toggleOpen(true);
    }
    
    return(
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={handleOpenDrawer}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link href="/system/gate/dashboard" underline="none">
                            入退場管理システム
                        </Link>
                    </Typography>
                    <LogoutButton />
                </Toolbar>
            </AppBar>
            <HeaderDrawer
                open={open}
                toggleOpen={toggleOpen}
            />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                {props.children}
            </main>
        </div>
    )
}