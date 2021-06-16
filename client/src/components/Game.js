import React, {useState, useEffect} from "react";
import "./Game.css";
import Loader from "../components/Loader";
import * as GameService from "../GameService";
import Board from "../components/Board";
import EventContext from "../EventContext";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navbar from "./Navbar";
import {useParams} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import WinModal from "./WinModal";
import {useHistory} from "react-router-dom";
import ScoreCard from "./ScoreCard";
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const Game = ({setAuth}) => {
    const [loading, setLoading] = useState(true);
    const [cells, setCells] = useState([]);
    const [turn, setTurn] = useState(null);
    const [gameData, setGameData] = useState(null)
    const [locked, setLocked] = useState(true)
    const [playerOne, setPlayerOne] = useState(true)
    const [playerTwo, setPlayerTwo] = useState(true)
    const [user, setUser] = useState(null)
    const [winner, setWinner] = useState(false);
    const [openWinner, setOpenWinner] = useState(false);
    let {id} = useParams();
    const classes = useStyles();
    const history = useHistory();

    const getPlayerAndUser = async () => {
        const use = await fetch(`/game/players/${id}`, {
            method: "POST",
            headers: {jwt_token: localStorage.token}
        });

        const parseData = await use.json();
        setPlayerOne(parseData.playerOne)
        setPlayerTwo(parseData.playerTwo)
        setUser(parseData.user)
    }

    const fetchInitialState = async () => {
        if (user) {
            const savedGame = await getSavedGame(id)

            if (!savedGame.game) {
                //show error
            }

            if (savedGame.game.saved_game) {
                setCells(savedGame.game.saved_game);
                setGameData(savedGame.game)
                setTurn(savedGame.game.current_turn ? 1 : 0);
                if (savedGame.game.status === "WON") {
                    setWinner(true)
                }
                setLoading(false);

            } else {
                const {board, turn} = await GameService.getInitialBoard();
                const gameData = await saveState(board, turn, id, false);
                setGameData(gameData)
                setCells(board);
                setTurn(turn);
                setLoading(false);
            }
        }

    }

    useEffect(async () => {
        getPlayerAndUser()

    }, []);

    useEffect(async () => {
        fetchInitialState();
    }, [user])

    useEffect(async () => {

        if (gameData) {
            const myTurn = GameService.checkTurn(gameData, user, turn)
            setLocked(!myTurn)

            if (!myTurn) {
                const interval = setInterval(async () => {
                    const savedGame = await getSavedGame(id)

                    if (!savedGame.game) {
                        setAuth(false);
                        return
                    }

                    setCells(savedGame.game.saved_game);
                    setGameData(savedGame.game)

                    if (savedGame.game.status === "WON") {
                        setWinner(true)
                    } else {
                        setTurn(savedGame.game.current_turn ? 1 : 0);
                        const currentTurn = GameService.checkTurn(gameData, user, savedGame.game.current_turn ? 1 : 0)
                        setLocked(!currentTurn)
                        setWinner(false)
                        if (currentTurn) {
                            clearInterval(interval);
                        }

                    }
                }, 1000);
            }
        }

    }, [turn]);

    useEffect(() => {
        if (winner) {
            setLocked(true)
            setOpenWinner(true)
        }
    }, [winner])

    const handleSquareSelected = async (col) => {

        if (!locked) {
            const [board, moved, lastPiece] = GameService.move(cells, col, turn);

            if (moved === true) {
                const win = GameService.checkForWin(board, turn, lastPiece)
                setWinner(win)
                setCells(board);
                setTurn(1 - turn);
                const savedGame = await saveState(board, 1 - turn, id, win);
                setGameData(savedGame)
            }
        }
    };

    const saveState = async (board, turn, gameId, win) => {
        try {
            const body = {board: board, turn: turn, status: win ? "WON" : "IN_PROGRESS"}

            const response = await fetch(
                `/game/save/${gameId}`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json", jwt_token: localStorage.token},
                    body: JSON.stringify(body)
                }
            );
            return await response.json();

        } catch (err) {
            console.error(err.message);
        }
    }

    const getSavedGame = async (id) => {
        try {
            const res = await fetch(
                `/game/${id}`,
                {
                    method: "POST",
                    headers: {jwt_token: localStorage.token},
                }
            );

            return await res.json();
        } catch {

        }
    }

    const handleReset = async () => {
        if (winner) {
            const {board, turn} = await GameService.getInitialBoard();
            const gameData = await saveState(board, turn, id, false);
            setGameData(gameData)
            setCells(board);
            setTurn(turn);
            setWinner(false);
            setLoading(false);
        }
    }

    const handleCloseWinner = () => {
        setOpenWinner(false);
    };

    return (
        <React.Fragment>
            <CssBaseline/>

            <Navbar setAuth={setAuth}/>
            <div className="game">
                {loading ? (
                    <Loader/>
                ) : (
                    <main className={classes.layout}>
                        <EventContext.Provider value={{handleSquareSelected, user}}>
                            <Grid container spacing={2}>
                                <Grid item sm={2}>
                                    <ScoreCard playerNumber={0} player={playerOne} turn={turn} winner={winner}/>
                                </Grid>
                                <Grid item sm={8}>
                                    <Board className="board" cells={cells}/>
                                </Grid>
                                <Grid item sm={2}>
                                    <ScoreCard playerNumber={1} player={playerTwo} turn={turn} winner={winner}/>
                                </Grid>
                            </Grid>
                            <WinModal open={openWinner} handleClose={handleCloseWinner}/>

                            {winner &&
                            <Box m={2} pt={3}>
                                <Grid container justify="center">
                                    <Button size="large"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleReset}>
                                        reset
                                    </Button>
                                </Grid>
                            </Box>
                            }


                        </EventContext.Provider>
                    </main>
                )}
            </div>
        </React.Fragment>
    );

}

export default Game;