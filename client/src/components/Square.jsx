import React, {useContext} from "react";
import EventContext from "../EventContext";
import Piece from "./Piece";

const Square = ({model, row, col}) => {
    const {handleSquareSelected} = useContext(EventContext);
    const handleClick = () => {
        handleSquareSelected(col);
    };
    return (
        <div className="square" onClick={handleClick}>
            {model.piece && <Piece model={model.piece} row={row} col={col} />}
        </div>
    );
};

export default Square;