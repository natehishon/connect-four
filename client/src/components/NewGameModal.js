import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHistory} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";


const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export default function NewGameModal({open: open, handleClose: handleClose, propUser: user}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [created, setCreated] = useState(false)
    const [newGame, setNewGame] = useState(null)
    const history = useHistory();
    const [inputs, setInputs] = useState({
        name: "",
    })

    const {name} = inputs

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

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

    const onSubmitForm = async e => {
        e.preventDefault();

        try {
            const body = {user_id: user.user_id, name: name};
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

            <form noValidate onSubmit={onSubmitForm}>
                <TextField
                    value={name}
                    onChange={e => onChange(e)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Name of game"
                    id="name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Create
                </Button>
            </form>
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