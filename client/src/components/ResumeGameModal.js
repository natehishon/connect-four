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
        //get games to join
        if(user.user_id){
            try {
                console.log(user.user_id)
                const response = await fetch(
                    `/game/resume/${user.user_id}`,
                    {
                        method: "GET",
                        headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    }
                );

                const parseRes = await response.json();
                setResumeGames(parseRes);
                //show stuff

            } catch (err) {
                console.error(err.message);
            }
        }



    }, [user])

    const handleJoinGame = async (gameId) => {

        try {
            console.log(user.user_id)
            const body = {user_id: user.user_id}
            const response = await fetch(
                `/game/join/${gameId}`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();
            console.log(parseRes)
            //show stuff

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
                    <h2 id="simple-modal-title">Resume Game!</h2>

                    {resumeGames.map((game, id) => (
                        <div className="board-row" key={id}>
                            {/*<button onClick={() => handleJoinGame(game.game_id)}>join</button>*/}
                            <Link href={`/game/${game.game_id}`} variant="body2">{game.game_id}</Link>
                        </div>
                    ))}

                    {/*{progGames.map((game, id) => (*/}
                    {/*    <div className="board-row" key={id}>*/}
                    {/*        {game.game_id}*/}
                    {/*        <button onClick={() => handleJoinGame(game.game_id)}>join</button>*/}
                    {/*    </div>*/}
                    {/*))}*/}

                </div>
            </Modal>
        </div>
    );
}