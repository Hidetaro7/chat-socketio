"use strict";

const express = require("express");
const app = express();
const multer = require("multer");
const PORT = process.env.PORT || 3000;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io").listen(server);
const bodyParser = require("body-parser");

app.use(express.static(__dirname + "/public"));
app.use("/socket.io", express.static("node_modules/socket.io-client/dist"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var upload = multer({ dest: "./public/uploads/" });

app.post("/upload", upload.single("imagefile"), (req, res) => {
  // 'http://localhost:3000/upload'にアクセスがあったら
  console.log(req.file);
  console.log(req.body);
  io.emit("imagemessage", req.file);
  res.status(200).json(req.file);
});

app.post("/message", (req, res) => {
  // 'http://localhost:3000/message'にアクセスがあったら
  io.emit("textmessage", req.body);
  res.status(200).json(req.body);
});

io.on("connection", socket => {
  console.log("ユーザーからのアクセスがありました");
  socket.on("disconnect", function() {
    console.log("ユーザーがアクセスを遮断しました");
  });
});

server.listen(PORT, () => console.log(`listening ${PORT} port`));
