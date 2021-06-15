import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Link from "@material-ui/core/Link";

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

export default function ResumeGameModal({open: open, handleClose: handleClose, propUser:user}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [resumeGames, setResumeGames] = useState([])

    useEffect(async ()  => {
        if(user.user_id){
            try {
                const response = await fetch(
                    `/game/resume/${user.user_id}`,
                    {
                        method: "GET",
                        headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    }
                );

                const parseRes = await response.json();
                setResumeGames(parseRes);

            } catch (err) {
                console.error(err.message);
            }
        }

    }, [user])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <h2 id="simple-modal-title">Resume Game!</h2>

                    {resumeGames.map((game, id) => (
                        <div className="board-row" key={id}>
                            <Link href={`/game/${game.game_id}`} variant="body2">{game.game_id}</Link>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}