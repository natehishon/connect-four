import React, {useContext} from "react";
import EventContext from "../EventContext";
import Piece from "./Piece";

const Square = ({model, row, col}) => {
    //black square will forward user event to Game.
    // console.log("model")
    // console.log(model)
    // console.log(row)
    // console.log(col)
    const {handleSquareSelected} = useContext(EventContext);
    const handleClick = () => {
        //forwarding user event to Game.
        handleSquareSelected(col);
    };
    return (
        <div className="square" onClick={handleClick}>
            {model.piece && <Piece model={model.piece} row={row} col={col} />}
        </div>
    );
};

export default Square;