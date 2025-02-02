## 🚀 Features
✅ **Real-time chess gameplay** using **Socket.io**  
✅ **Drag-and-drop movement** for chess pieces  
✅ **Turn-based play** with move validation  
✅ **Automatic board flipping** for the Black player  
✅ **Game resets when a player leaves**  
✅ **Spectator mode** for additional users  

---

## ⚙️ Technologies Used
| **Technology** | **Purpose** |
|--------------|------------|
| **Node.js** | Backend runtime for handling server logic |
| **Express.js** | Web framework for routing |
| **Socket.io** | Enables real-time communication |
| **Chess.js** | Handles game rules and move validation |
| **EJS (Embedded JavaScript)** | Templating engine for rendering frontend |
| **Tailwind CSS** | Used for styling the chessboard |
| **HTML, CSS, JavaScript** | Frontend logic for UI & interactions |

---

## 📂 Backend - `server.js`
The backend is built with **Express.js** and uses **Socket.io** for real-time interactions.

### 🔹 **1️⃣ Player Role Assignment**
- The first player is **White (`w`)**.
- The second player is **Black (`b`)**.
- Any extra players become **spectators**.

```js
io.on("connection", (socket) => {
  console.log("A new client connected: " + socket.id);

  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  } else {
    socket.emit("spectatorRole");
  }
});

2️⃣ Move Handling & Validation

socket.on("move", (move) => {
  if (chess.turn() === "w" && socket.id !== players.white) return;
  if (chess.turn() === "b" && socket.id !== players.black) return;

  const result = chess.move(move);
  if (result) {
    io.emit("move", move);
    io.emit("boardState", chess.fen()); // Sync board state for all clients
  } else {
    socket.emit("moveError", "Invalid move");
  }
});


3️⃣ Game Reset on Player Disconnect

socket.on("disconnect", () => {
  if (socket.id === players.white) {
    delete players.white;
    resetGame();
  } else if (socket.id === players.black) {
    delete players.black;
    resetGame();
  }
});

function resetGame() {
  chess.reset();
  io.emit("boardState", chess.fen());
}


## Frontend  

The frontend handles drag-and-drop movement and updates the board dynamically.

🔹 1️⃣ Drag-and-Drop Piece Movement
const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q"
  };

  // Validate move before sending
  const validMove = chess.move(move);
  if (validMove) {
    socket.emit("move", move);
  } else {
    console.log("Invalid move:", move);
  }
};

2️⃣ Automatic Board Flipping for Black

socket.on("playerRole", (role) => {
  playerRole = role;
  renderBoard();

  if (playerRole === "b") {
    boardElement.classList.add("flipped"); // Flip board for Black
  } else {
    boardElement.classList.remove("flipped");
  }
});


🎮 How to Play?
Open the game in a browser (http://localhost:3000).
The first player to join gets White (w).
The second player gets Black (b).
Drag and drop pieces to make moves.
The board flips for the Black player.
If a player disconnects, the game resets.