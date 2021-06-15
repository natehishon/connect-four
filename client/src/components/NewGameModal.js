import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

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

export default function NewGameModal({open: open, handleClose: handleClose, propUser:user}) {
// export default function NewGameModal(props) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const handleNewGame = async () => {

        //user?

        try {
            const body = {user_id: user.user_id};
            console.log(body);
            const response = await fetch(
                "/game/new",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();
            //show stuff

        } catch (err) {
            console.error(err.message);
        }
    }

        const body = (
            <div style={modalStyle} className={classes.paper}>
                <h2 id="simple-modal-title">New Game!</h2>
                <p id="simple-modal-description">
                    {user.user_id}
                </p>
                <Button fullWidth variant="outlined" color="primary" onClick={handleNewGame}>
                    New Game
                </Button>

            </div>
        );

        return (
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </div>
        );
    }