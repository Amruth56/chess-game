// server side code

const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");
const app = express(); //  for routing part and middleware
const server = http.createServer(app); // http server should be based on express server

// socket.emit() sends a message only to the specific client that triggered the event (i.e., the current socket connection).
// io.emit() sends a message to all connected clients (broadcasts to everyone).

const io = socket(server);
const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

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

  socket.on("disconnect", () => {
    if (socket.id === players.white) {
      delete players.white;
      resetGame()
    } else if (socket.id === players.black) {
      delete players.black;
      resetGame()
    }
  });
  function resetGame() {
    chess.reset();
    io.emit("boardState", chess.fen());
  }

  socket.on('move', (move)=> {
    try{
        if(chess.turn()==="w" && socket.id !== players.white) return
        if(chess.turn() ==="b" && socket.id !==players.black) return

        const result = chess.move(move)
        if(result){
            currentPlayer = chess.turn() === "w" ? "w" : "b"
            io.emit('move', move)
            io.emit("boardState", chess.fen())
        } else{
            console.log("Invalid move", move)
            socket.emit(move, "invalid")
        }
    }
    catch(err){ 
        console.log(err);
        socket(move);
    }

  })
});

server.listen(3000);
