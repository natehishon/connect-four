import React from "react";
import Color from "../models/Color";

const Piece = ({model}) => {
  return (
    <span className={model.color === Color.BLACK ? "piece blue-piece" : "piece red-piece"}>
    </span>
  );
};

export default Piece;
