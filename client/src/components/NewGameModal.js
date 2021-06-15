import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHistory} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import * as GameService from "../GameService";

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

export default function NewGameModal({open: open, handleClose: handleClose, propUser: user}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [created, setCreated] = useState(false)
    const [newGame, setNewGame] = useState(null)
    const history = useHistory();

    // Programmatically navigate

    useEffect(() => {
        if (created) {
            setCreated(false)
        }
    }, [handleClose]);

    useEffect(async () => {
        if (created) {
            const interval = setInterval(async () => {
                const res = await fetch(
                    `/game/${newGame.game_id}`,
                    {
                        method: "POST",
                        headers: {jwt_token: localStorage.token},
                    }
                );

                const response = await res.json()

                if (response.game.status === "IN_PROGRESS") {
                    history.push(`/game/${response.game.game_id}`);
                    clearInterval(interval);

                }

            }, 3000);
        }
    }, [created])

    const handleNewGame = async () => {

        try {
            const body = {user_id: user.user_id};
            const response = await fetch(
                "/game/new",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();
            setNewGame(parseRes);
            setCreated(true)

        } catch (err) {
            console.error(err.message);
        }
    }

    const create = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">New Game!</h2>
            <Button fullWidth variant="contained" color="primary" onClick={handleNewGame}>
                New Game
            </Button>

        </div>
    );

    const wait = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">waiting for a player to join</h2>
            <Grid container justify="center">
                <CircularProgress/>
            </Grid>
        </div>
    )

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {
                    created ? wait : create
                }
            </Modal>
        </div>
    );
}