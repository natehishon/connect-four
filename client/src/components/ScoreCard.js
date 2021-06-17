import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({

    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },


    turnButton : {
        cursor: "default",
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: "transparent"
        },
        "& .MuiTouchRipple-root span":{
            backgroundColor: 'transparent',
            opacity: .0,
        },
    }


}));

export default function ScoreCard({playerNumber: playerNumber, player: player, turn: turn, winner: winner}) {
    const classes = useStyles();

    const playerName = playerNumber ? "Player Two" : "Player One"
    const playerColor = playerNumber ? "secondary" : "primary"

    return (
        <React.Fragment>
            <Card>
                <CardHeader
                    title={playerName}
                    titleTypographyProps={{align: 'center'}}
                    subheaderTypographyProps={{align: 'center'}}
                    className={classes.cardHeader}
                />
                <CardContent>
                    <Typography variant="subtitle1" align="center">
                        {player.user_name}
                    </Typography>
                </CardContent>
                <CardActions>

                    <Button fullWidth color={turn === playerNumber ? playerColor : ''} disabled={(turn !== playerNumber) || winner} className={classes.turnButton} >
                        TURN
                    </Button>
                </CardActions>
            </Card>

        </React.Fragment>
    );
}