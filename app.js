const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require('path')
const app = express(); //  for routing part and middleware
const server = http.createServer(app); // http server should be based on express server

const io = socket(server);
const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res)=> {
    res.render("index", {title: "Chess Game"})
})

io.on("connection", (socket)=> {
    console.log("A new client connected: " + socket.id);

    socket.on("disconnect",()=> {
        console.log("Client disconnected");
    } )
})

server.listen(3000)