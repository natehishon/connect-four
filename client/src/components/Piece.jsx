import React from "react";
import Color from "../models/Color";

const Piece = ({model}) => {
  return (
    <span className={model.color === Color.RED ? "piece red-piece" : "piece blue-piece"}>
    </span>
  );
};

export default Piece;
