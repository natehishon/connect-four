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

    //get user stuff
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

    //get inital game board
    const fetchInitialState = async () => {
        if (user) {
            const savedGame = await GameService.getSavedGame(id)

            if(!savedGame.game){
                //show error
            }

            //new game
            if (!savedGame.game.saved_game) {
                const {board, turn} = await GameService.getInitialBoard();
                const gameData = await GameService.saveState(board, turn, id, false);
                setGameData(gameData)
                setCells(board);
                setTurn(turn);
                setLoading(false);
            } else {
                if (savedGame.game.status === "WON") {
                    setWinner(true)
                }
                setCells(savedGame.game.saved_game);
                setGameData(savedGame.game)
                setTurn(savedGame.game.current_turn ? 1 : 0);
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

        if (gameData != null) {
            const check = GameService.checkTurn(gameData, user, turn)
            setLocked(!check)
            if (!check) {
                const interval = setInterval(async () => {
                    const savedGame = await GameService.getSavedGame(id)
                    setCells(savedGame.game.saved_game);
                    setGameData(savedGame.game)
                    if (savedGame.game.status === "WON") {
                        setWinner(true)
                    } else {
                        setTurn(savedGame.game.current_turn ? 1 : 0);
                        const currentTurn = GameService.checkTurn(gameData, user, savedGame.game.current_turn ? 1 : 0)
                        setLocked(!currentTurn)
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

    const handleSquareSelected = (col) => {

        if (!locked) {
            const [board, moved, lastPiece] = GameService.move(cells, col, turn, id);

            if (moved === true) {
                const win = GameService.checkForWin(board, turn, lastPiece)

                setWinner(win)
                setCells(board);
                setTurn(1 - turn);

                async function saveState() {
                    const savedGame = await GameService.saveState(board, 1 - turn, id, win);
                    setGameData(savedGame)
                }

                saveState();
            }
        }

    };

    const handleReset = async () => {
        if (winner) {
            const {board, turn} = await GameService.getInitialBoard();
            const gameData = await GameService.saveState(board, turn, id, false);
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
                        {/*<Paper className={classes.paper}>*/}
                        <div className="game-board">
                            <EventContext.Provider value={{handleSquareSelected, user}}>

                                <Grid container spacing={2}>
                                    <Grid item sm={1}>
                                        <span>player one: {playerOne.user_name}</span>
                                        {turn ? <div>not my turn</div> : <div>my turn</div>}
                                    </Grid>
                                    <Grid item sm={10}>
                                        <Board cells={cells}/>
                                    </Grid>
                                    <Grid item sm={1}>
                                        <span>player two: {playerTwo.user_name}</span>

                                        {turn ? <div>my turn</div> : <div>not my turn</div>}
                                    </Grid>
                                </Grid>
                                {locked.toString()}
                                {turn.toString()}
                                <WinModal open={openWinner} handleClose={handleCloseWinner}/>

                                <button onClick={handleReset}>reset</button>

                            </EventContext.Provider>
                        </div>
                        {/*</Paper>*/}
                    </main>
                )}
            </div>
        </React.Fragment>
    );

}

export default Game;