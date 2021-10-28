import React, { useContext } from 'react'
import { Typography } from '@material-ui/core'
import { userContext } from '../context/user';


export default function Forbidden (props) {

    const userData = useContext(userContext)
    const isLoading = userData.data.user_id===null;
    const isForbidden = isLoading || !userData.data.authority.includes(props.authority)

    return(
        isLoading ? null :
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