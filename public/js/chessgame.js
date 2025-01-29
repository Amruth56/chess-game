const socket = io();
const chess = new Chess()
const boardElement = document.querySelector(".chessboard")

let draggedPiece = null
let sourceSquare = null
let playerRole = null

const renderBoard = () => {
    const board = chess.board()
    boardElement.innerHTML = ""
    board.forEach((row, rowindex)=> {
        row.forEach((square, squareIndex)=> {
            const squareElement=document.createElement("div")
            squareElement.classList.add("square", (rowindex+squareIndex)%2===1 ? "dark" : "light")

            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareIndex;

            if(square){
                const pieceElement = document.createElement("div")
                pieceElement.classList.add("piece", square.color === 'w' ? "white" : "black")

                pieceElement.innerText = ""
                pieceElement.draggable= playerRole === square.color
            }

        })
    })
}

const handleMove = ()=> {

}

const getPieceUnicode = () => {

}

renderBoard()