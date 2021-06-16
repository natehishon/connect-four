import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export default function SimpleList({games: games, type: type, user: user}) {
    const classes = useStyles();
    const history = useHistory();

    const handleJoinGame = async (gameId) => {
        try {
            const body = {user_id: user.user_id}
            const res = await fetch(
                `/game/join/${gameId}`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    body: JSON.stringify(body)
                }
            );

            const response = await res.json();

            if (response.success === true) {
                history.push(`/game/${gameId}`);
            }

        } catch (err) {
            console.error(err.message);
        }

    }

    if (type === "join") {
        return (
            <div className={classes.root}>
                <List component="nav" aria-label="main mailbox folders">
                    {games.map((game, id) => (
                        <ListItem button onClick={() => handleJoinGame(game.game_id)}>
                            {game.name}
                        </ListItem>
                    ))}
                </List>
            </div>
        )
    }

    if (type === "resume") {
        return (
            <div className={classes.root}>
                <List component="nav" aria-label="main mailbox folders">
                    {games.map((game, id) => (
                        <ListItemLink href={`/game/${game.game_id}`}>
                            <ListItemText primary={`${game.name}`}/>
                        </ListItemLink>
                    ))}
                </List>
            </div>
        )
    }

    return (
        <div>Not Found</div>
    )


}