import React, {useContext} from "react";
import Color from "../models/Color";
// import Highlight from "./Highlight";
// import King from "./King";
import EventContext from "../EventContext";

const Piece = ({model, row, col}) => {
  //piece should forward user event to Game
  // const {handlePieceSelected} = useContext(EventContext);

  // const handleClick = () => {
  //   //Forwarding user click to the Game
  //   handlePieceSelected(row, col);
  // };
  return (
    <span className={model.color === Color.BLACK ? "piece blue-piece" : "piece red-piece"}>
      {/*if the piece can be selectable, it should be highlighted*/}
      {/*{model.selectable && <Highlight onClick={handleClick} />}*/}
      {/*/!*if the piece is king it should be rendered differently *!/*/}
      {/*{model.king && <King />}*/}
    </span>
  );
};

export default Piece;
