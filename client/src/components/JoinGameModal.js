import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {useHistory} from "react-router-dom";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function JoinGameModel({open: open, handleClose: handleClose, propUser: user}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [newGames, setNewGames] = useState([])
    const history = useHistory();

    useEffect(async () => {

        if (user.user_id) {
            try {
                const response = await fetch(
                    `/game/in-progress/${user.user_id}`,
                    {
                        method: "GET",
                        headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    }
                );

                const parseRes = await response.json();
                setNewGames(parseRes.newGames);

            } catch (err) {
                console.error(err.message);
            }
        }

    }, [user])

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

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <h2 id="simple-modal-title">Join Game!</h2>

                    {newGames.map((game, id) => (
                        <div className="board-row" key={id}>
                            {game.game_id}
                            <button onClick={() => handleJoinGame(game.game_id)}>join</button>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}