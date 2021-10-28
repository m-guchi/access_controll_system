import React from 'react'
import { Button } from '@material-ui/core';
import { Logout } from './Logout';

export default function LogoutButton (props) {
    const handleLogoutButton = () => {
        Logout();
    }
    return(
        <Button onClick={handleLogoutButton} >ログアウト</Button>
    )
}