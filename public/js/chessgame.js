    const socket = io();
    const chess = new Chess();
    const boardElement = document.querySelector(".chessboard");
  
    let draggedPiece = null;
    let sourceSquare = null;
    let playerRole = null;
  
    const renderBoard = () => {
      const board = chess.board();
      boardElement.innerHTML = "";
      board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
          const squareElement = document.createElement("div");
          squareElement.classList.add(
            "square",
            (rowindex + squareindex) % 2 === 1 ? "dark" : "light"
          );
  
          squareElement.dataset.row = rowindex;
          squareElement.dataset.col = squareindex;
  
          if (square) {
            const pieceElement = document.createElement("div");
            pieceElement.classList.add(
              "piece",
              square.color === "w" ? "white" : "black"
            );
  
            pieceElement.innerText = getPieceUnicode(square);
            pieceElement.draggable = playerRole === square.color;
  
            pieceElement.addEventListener("dragstart", (e) => {
              if (pieceElement.draggable) {
                draggedPiece = pieceElement;
                sourceSquare = { row: rowindex, col: squareindex };
                e.dataTransfer.setData("text/plain", " ");
              }
            });
            pieceElement.addEventListener("dragend", (e) => {
              draggedPiece = null;
              sourceSquare = null;
            });
  
            squareElement.appendChild(pieceElement);
          }
  
          squareElement.addEventListener("dragover", (e) => {
            e.preventDefault();
          });
  
          squareElement.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedPiece) {
              const targetSource = {
                row: parseInt(squareElement.dataset.row),
                col: parseInt(squareElement.dataset.col),
              };

              // from source square to target square 
              handleMove(sourceSquare, targetSource);
            }
          });
          boardElement.appendChild(squareElement );
        });
      });
      if(playerRole==='b'){
        boardElement.classList.add("flipped")
      } else {
        boardElement.classList.remove("flipped")
      }
    };
  
    const handleMove = (source, target) => {
      const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`, 
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q", // Promote pawn if needed
      };
    
      // Validate the move before sending
      const validMove = chess.move(move);
      if (validMove) {
        socket.emit("move", move);
      } else {
        console.log("Invalid move:", move);
      }
    };
    
  
    const getPieceUnicode = (piece) => { 
      const unicodePieces = {
        p: "♙",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",
        P: "♙",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔"
      };
      return unicodePieces[piece.type] || ""
    };
  
    socket.on("playerRole", (role) => {
      playerRole = role;
      renderBoard();
    
      if (playerRole === "b") {
        boardElement.classList.add("flipped");
      } else {
        boardElement.classList.remove("flipped");
      }
    });
    
    socket.on("spectatorRole", ()=> {
      playerRole = null;
      renderBoard();
    })
    socket.on("boardState", (fen)=> {
       chess.load(fen)
       renderBoard()
    })
    socket.on("move", (move)=> {
       chess.move(move)
       renderBoard()
    })
    renderBoard();
  