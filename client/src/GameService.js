import Cell from "./models/Cell";
import Color from "./models/Color";
import Piece from "./models/Piece";

export const BOARD_ROWS = 6;
export const BOARD_COLUMNS = 7;


export const setUpGame = () => {
    const board = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
        const rowArray = new Array(BOARD_ROWS);
        for (let col = 0; col < BOARD_COLUMNS; col++) {
            rowArray[col] = {...Cell};
        }
        board.push(rowArray);
    }
    return board;
};

export const getInitialBoard = async () => {
    return new Promise((resolFunc, rejectFunc) => {
        const board = setUpGame();
        resolFunc({board, turn: 0});
    });
};

export const getSavedGame = async (id) => {

    const res = await fetch(
        `/game/${id}`,
        {
            method: "POST",
            headers: {jwt_token: localStorage.token},
        }
    );

    return await res.json();
}

export const saveState = async (board, turn, gameId, win) => {

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
};

export const checkTurn = (gameData, user, inputTurn) => {

        if (gameData.player_one_id === user && inputTurn === 0) {
            return true;
        }

        if (gameData.player_two_id === user && inputTurn === 1) {
            return true
        }
}


export const move = (board, col, turn, gameId) => {
    let i = BOARD_ROWS - 1;
    let moved = false;
    let lastPiece = [0, 0];


    if (board[0][col].hasPiece === true) {
        return [board, moved];
    }

    while (i >= 0) {
        if (board[i][col].hasPiece === false) {
            board[i][col].hasPiece = true;
            board[i][col].piece = {...Piece};
            board[i][col].piece.color = turn ? Color.BLACK : Color.WHITE;
            lastPiece = [i, col]
            moved = true
            break;
        }
        i--;
    }

    return [board, moved, lastPiece];
};

export const diagonalURDLCheck = (board, turn, lastPiece) => {
    let [row, col] = lastPiece;
    let winCounter = 0;
    let win = false;

    //diag up right
    let diagUpRightRow = row;
    let diagUpRightCol = col;
    while (winCounter < 3) {
        if (
            (diagUpRightRow > 0) &&
            board[diagUpRightRow - 1][diagUpRightCol + 1] &&
            board[diagUpRightRow - 1][diagUpRightCol + 1].piece &&
            board[diagUpRightRow - 1][diagUpRightCol + 1].piece.color === turn
        ) {
            winCounter++;
            diagUpRightRow -= 1
            diagUpRightCol += 1
            if (winCounter === 3) {
                return true;
            }
            continue;
        }
        break;
    }

    //diag down left
    let diagDownLeftRow = row;
    let diagDownLeftCol = col;
    while (winCounter < 3) {
        if (
            //row = 5 col = 6
            (diagDownLeftRow < 5) &&
            board[diagDownLeftRow + 1][diagDownLeftCol - 1] &&
            board[diagDownLeftRow + 1][diagDownLeftCol - 1].piece &&
            board[diagDownLeftRow + 1][diagDownLeftCol - 1].piece.color === turn
        ) {
            winCounter++;
            diagDownLeftRow += 1
            diagDownLeftCol -= 1
            if (winCounter === 3) {
                return true;
            }
            continue;
        }
        break;
    }

    return win;

}

export const diagonalULDRCheck = (board, turn, lastPiece) => {
    let [row, col] = lastPiece;
    let winCounter = 0;
    let win = false;

    // diag down right
    let diagDownRightRow = row;
    let diagDownRightCol = col;
    while (winCounter < 3) {
        if (
            (diagDownRightRow < 5) &&
            board[diagDownRightRow + 1][diagDownRightCol + 1] &&
            board[diagDownRightRow + 1][diagDownRightCol + 1].piece &&
            board[diagDownRightRow + 1][diagDownRightCol + 1].piece.color === turn
        ) {
            winCounter++;
            diagDownRightRow += 1
            diagDownRightCol += 1
            if (winCounter === 3) {
                return true;
            }
            continue;
        }
        break;
    }

    let diagUpLeftRow = row;
    let diagUpLeftCol = col;
    while (winCounter < 3) {

        if (
            (diagUpLeftRow > 0) &&
            board[diagUpLeftRow - 1][diagUpLeftCol - 1] &&
            board[diagUpLeftRow - 1][diagUpLeftCol - 1].piece &&
            board[diagUpLeftRow - 1][diagUpLeftCol - 1].piece.color === turn
        ) {
            winCounter++;
            diagUpLeftRow -= 1
            diagUpLeftCol -= 1
            if (winCounter === 3) {
                return true;
            }
            continue;
        }
        break;
    }

    return win;

}


export const verticalCheck = (board, turn, lastPiece) => {
    let [row, col] = lastPiece;
    let parentRow = row;
    let winCounter = 0;
    let win = false;

    //down
    while (winCounter < 3) {
        if (
            parentRow <= 2 &&
            board[row + 1][col] &&
            board[row + 1][col].piece &&
            board[row + 1][col].piece.color === turn
        ) {
            winCounter++;
            row += 1
            if (winCounter === 3) {
                return true;
            }
            continue;
        }
        break;
    }

    return win;
}

export const horizontalCheck = (board, turn, lastPiece) => {
    let [row, col] = lastPiece;

    let winCounter = 0;
    let win = false;

    //right
    let horizontalRightRow = row;
    let horizontalRightCol = col;
    while (winCounter < 3) {
        if (
            board[horizontalRightRow][horizontalRightCol + 1] &&
            board[horizontalRightRow][horizontalRightCol + 1].piece &&
            board[horizontalRightRow][horizontalRightCol + 1].piece.color === turn
        ) {
            winCounter++;
            horizontalRightCol += 1
            if (winCounter === 3) {
                return true;
            }
            continue;
        }
        break;
    }

    //left
    let horizontalLeftRow = row;
    let horizontalLeftCol = col;
    while (winCounter < 3) {
        if (
            board[horizontalLeftRow][horizontalLeftCol - 1] &&
            board[horizontalLeftRow][horizontalLeftCol - 1].piece &&
            board[horizontalLeftRow][horizontalLeftCol - 1].piece.color === turn
        ) {
            winCounter++;
            horizontalLeftCol -= 1
            if (winCounter === 3) {
                return true;
            }
            continue;
        }
        break;
    }

    return win;

}

export const checkForWin = (board, turn, lastPiece) => {

    return (
        horizontalCheck(board, turn, lastPiece) ||
        verticalCheck(board, turn, lastPiece) ||
        diagonalULDRCheck(board, turn, lastPiece) ||
        diagonalURDLCheck(board, turn, lastPiece)
    )
}
