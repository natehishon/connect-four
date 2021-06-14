import React from "react";
import Square from "./Square";
// import WhiteSquare from "./WhiteSquare";
// import BlackSquare from "./BlackSquare";
const Board = ({cells}) => {

    return (
        <div>
            {cells.map((row, r) => (
                <div className="board-row" key={r}>
                    {row.map((cell, c) =>
                        <Square model={cell} row={r} col={c} key={c}/>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Board;
