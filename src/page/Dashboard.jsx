import React, { useContext }  from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Card, CardContent, CardActionArea, Typography } from '@material-ui/core';
import { userContext } from '../context/user';
import VisitorsCountPage from './VisitorsCount';


export default function DashboardPage (props) {

    const userData = useContext(userContext)
    if(!userData) return null;

    const isIncludeAuthority = (authority) => {
        return userData.data.authority.includes(authority)
    }

    return(
        <Grid container spacing={1}>
            {isIncludeAuthority("qr_scan") &&
                <Grid item sm={4} xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="/qr_scan">
                            <CardContent>
                                <Typography>QRコードスキャン</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    入場券のQRコードを読み取り、入退場記録を送信します。
                                    {isIncludeAuthority("ticket_reception") && 
                                        <>発券所では、入場券と予約QRコードを紐付けします。</>
                                    }
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            }
            {isIncludeAuthority("visitors_count") &&
                <>
                    <Grid item sm={4} xs={6}>
                        <Card variant="outlined">
                            <CardActionArea component={RouterLink} to="/visitors_count">
                                <CardContent>
                                    <Typography>会場内人数</Typography>
                                    <Typography variant="body2" color="textSecondary">現在時刻における、会場内の人数(合計・属性別)を表示しています。</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item sm={4} xs={6}>
                        <Card variant="outlined">
                            <CardActionArea component={RouterLink} to="/visitors_count_history">
                                <CardContent>
                                    <Typography>会場内人数推移</Typography>
                                    <Typography variant="body2" color="textSecondary">会場内の人数の推移をグラフで表示しています。<br/>(1分ごとに集計します)</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item sm={4} xs={6}>
                        <Card variant="outlined">
                            <CardActionArea component={RouterLink} to="/gate_count">
                                <CardContent>
                                    <Typography>受付通過人数</Typography>
                                    <Typography variant="body2" color="textSecondary">受付の通過人数を表示します。</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </>
            }
            {isIncludeAuthority("visitors_management") &&
                <Grid item sm={4} xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="/visitors_management">
                            <CardContent>
                                <Typography>参加者一覧</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    参加者を一覧で表示しています。右上の検索バーで絞り込み表示できます。
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            }
            {isIncludeAuthority("users_management") &&
                <Grid item sm={4} xs={6}>
                    <Card variant="outlined">
                        <CardActionArea component={RouterLink} to="/users_management">
                            <CardContent>
                                <Typography>ユーザー一覧</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    入退場管理システムにログインできるユーザーを一覧で表示しています。
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            }
            {isIncludeAuthority("visitors_count") &&
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <VisitorsCountPage dashboard />
                    </Card>
                </Grid>
            }
        </Grid>
    )
}