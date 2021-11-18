import React, { useContext } from 'react'
import { Typography } from '@material-ui/core'
import { userContext } from '../context/user';


export default function Forbidden (props) {

    const contextUser = useContext(userContext)
    const isForbidden = !contextUser.data.auth.includes(props.authority)

    return(
        isForbidden ?
            <div>
                <Typography variant="h5" color="error">403 Forbidden</Typography>
                <Typography color="error">このページを表示する権限がありません。</Typography>
                <Typography variant="caption">左上のメニューボタンから別のページをご覧ください。</Typography>
            </div>
        :
            props.children
    )
}