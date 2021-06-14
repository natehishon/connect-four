import React, {useState, useEffect} from "react";
import "./Game.css";
import Loader from "../components/Loader";
import * as GameService from "../GameService";
import Board from "../components/Board";
import EventContext from "../EventContext";

const Game = () => {
    const [loading, setLoading] = useState(true);
    const [cells, setCells] = useState([]);
    const [turn, setTurn] = useState(null);

    useEffect(() => {
        async function fetchInitialState() {
            const {board, turn} = await GameService.getInitialBoard();
            setCells(board);
            setTurn(turn);
            setLoading(false);
        }

        fetchInitialState();
    }, []);

    useEffect(async () => {

        //call?

        if (turn !== null){

        }

        // try {
        //     const body = { email, password };
        //     const response = await fetch(
        //         "/auth/login",
        //         {
        //             method: "POST",
        //             headers: {
        //                 "Content-type": "application/json"
        //             },
        //             body: JSON.stringify(body)
        //         }
        //     );
        //
        //     const parseRes = await response.json();
        //     localStorage.setItem("token", parseRes.jwtToken)
        //     setAuth(true)
        //
        //     // if (parseRes.jwtToken) {
        //     //     localStorage.setItem("token", parseRes.jwtToken);
        //     //     setAuth(true);
        //     // } else {
        //     //     setAuth(false);
        //     // }
        // } catch (err) {
        //     console.error(err.message);
        // }


    }, [turn]);

    const handleSquareSelected = (col) => {
        const [board, moved, lastPiece] = GameService.move(cells, col, turn);
        if(moved === true){
            GameService.checkForWin(board, turn, lastPiece)



            setCells(board);
            setTurn(1 - turn);

        }
    };

    return (
        <div className="game">
            {loading ? (
                <Loader/>
            ) : (
                <div className="game-board">
                    <EventContext.Provider value={{handleSquareSelected}}>
                        <Board cells={cells}/>
                    </EventContext.Provider>
                </div>
            )}
        </div>
    );

}

export default Game;