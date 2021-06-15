import React, {useState, useEffect} from "react";
import "./Game.css";
import Loader from "../components/Loader";
import * as GameService from "../GameService";
import Board from "../components/Board";
import EventContext from "../EventContext";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navbar from "./Navbar";
import {useParams} from 'react-router-dom';

const Game = ({setAuth, user}) => {
    const [loading, setLoading] = useState(true);
    const [cells, setCells] = useState([]);
    const [turn, setTurn] = useState(null);
    const [gameData, setGameData] = useState(null)
    const [locked, setLocked] = useState(true)
    let {id} = useParams();


    useEffect(() => {
        // console.log(id);

        async function fetchInitialState() {

            //todo this a a mess
            const savedGame = await GameService.getSavedGame(id)

            if (!savedGame.game.saved_game) {
                const {board, turn} = await GameService.getInitialBoard();
                const gameData = await GameService.saveState(board, turn, id);

                setGameData(gameData)
                setCells(board);
                setTurn(turn);
                setLoading(false);
            } else {
                setCells(savedGame.game.saved_game);
                setGameData(savedGame.game)
                setTurn(savedGame.game.current_turn ? 1 : 0);
                setLoading(false);
            }

        }

        fetchInitialState();
    }, []);

    useEffect(async () => {

        //todo this is a mess
        if (gameData != null) {
            const check = checkTurn(turn)
            console.log("check1")
            if (!check) {
                const interval = setInterval(async () => {
                    const savedGame = await GameService.getSavedGame(id)
                    setCells(savedGame.game.saved_game);
                    setGameData(savedGame.game)
                    setTurn(savedGame.game.current_turn ? 1 : 0);
                    const currentTurn = checkTurn(savedGame.game.current_turn ? 1 : 0)
                    if (currentTurn) {
                        clearInterval(interval);
                    }

                }, 3000);
            }
        }

    }, [turn]);

    const handleSquareSelected = (col) => {

        if (!locked) {
            const [board, moved, lastPiece] = GameService.move(cells, col, turn, id);

            if (moved === true) {
                GameService.checkForWin(board, turn, lastPiece)

                setCells(board);
                setTurn(1 - turn);

                async function saveState() {
                    await GameService.saveState(board, 1 - turn, id);
                }

                saveState();
            }
        }

    };

    const checkTurn = (inputTurn) => {

        if (gameData.player_one_id === user.user_id && inputTurn === 0) {
            setLocked(false)
            return true;
        }

        if (gameData.player_two_id === user.user_id && inputTurn === 1) {
            setLocked(false)
            return true
        }
        setLocked(true)
        return false;
    }

    return (
        <React.Fragment>
            <CssBaseline/>

            <Navbar setAuth={setAuth}/>
            <div className="game">
                {loading ? (
                    <Loader/>
                ) : (
                    <div className="game-board">
                        <EventContext.Provider value={{handleSquareSelected, user}}>
                            <span>{turn}</span>
                            <span>{locked.toString()}</span>
                            <Board cells={cells}/>
                        </EventContext.Provider>
                    </div>
                )}
            </div>
        </React.Fragment>
    );

}

export default Game;