import React, { useContext }  from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Card, CardContent, CardActionArea, Typography } from '@material-ui/core';
import { userContext } from '../context/user';
import { infoContext } from '../context/info';
import UserCountPage from './UserCount';


export default function DashboardPage (props) {

    const contextUser = useContext(userContext)
    const contextInfo = useContext(infoContext);

    const isIncludeAuthority = (authority) => {
        return contextUser.data.auth.includes(authority)
    }

    return(
        <Grid container spacing={1}>
            {/* <Grid item sm={4} xs={6}>
                <Card variant="outlined">
                    <CardActionArea component={RouterLink} to="/user_count">
                        <CardContent>
                            <Typography>会場内人数</Typography>
                            <Typography variant="body2" color="textSecondary">会場内の人数や定員に対する割合などを表示します。(ダッシュボードと同じものが表示されます)</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid> */}
            {isIncludeAuthority("record_user_pass") &&
                <Grid item sm={4} xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="/qr_scan">
                            <CardContent>
                                <Typography>通過情報登録</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    入力されたIDの通過記録を登録します。スマホのカメラを用いてQRコードでも登録できます。
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            }
            {isIncludeAuthority("users_mgmt") &&
                <>
                    <Grid item sm={4} xs={6}>
                        <Card variant="outlined">
                            <CardActionArea component={RouterLink} to="/user_list">
                                <CardContent>
                                    <Typography>ユーザー一覧</Typography>
                                    <Typography variant="body2" color="textSecondary">ユーザー一覧を表示します。最後に受付を通過した日時や場所も表示されます。</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item sm={4} xs={6}>
                        <Card variant="outlined">
                            <CardActionArea component={RouterLink} to="/user_search">
                                <CardContent>
                                    <Typography>ユーザー検索</Typography>
                                    <Typography variant="body2" color="textSecondary">エリアと日時を指定して、その日時にエリア内にいたユーザーを表示します。</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item sm={4} xs={6}>
                        <Card variant="outlined">
                            <CardActionArea component={RouterLink} to="/log_user_pass">
                                <CardContent>
                                    <Typography>受付通過記録</Typography>
                                    <Typography variant="body2" color="textSecondary">受付の通過記録一覧を表示します。右上の検索欄にユーザーIDを入力することで、特定のユーザーの通過記録が表示されます。</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    { Boolean(Number(contextInfo.data.setting.use_ticket.value)) &&
                        <Grid item sm={4} xs={6}>
                            <Card variant="outlined">
                                <CardActionArea component={RouterLink} to="/ticket_list">
                                    <CardContent>
                                        <Typography>チケット管理</Typography>
                                        <Typography variant="body2" color="textSecondary">チケット一覧を表示します。チケットはユーザーIDと紐付けて使用することが可能です。</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    }
                </>
            }
            <Grid item xs={12}>
                <Card variant="outlined">
                    <UserCountPage dashboard />
                </Card>
            </Grid>
        </Grid>
    )
}