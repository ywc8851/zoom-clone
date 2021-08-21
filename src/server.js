// express로 할일 : views를 설정해주고 render해줌
// 나머지는 websocket에서 실시간으로 일어남
// 백앤드에서 작동
import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
// user가 /public으로 가게되면 __dirname + "/src/public" 폴더를 보여줌
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

// frontend 에서 backend 으로 연결
wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  // 새로운메시지받기
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done(); // done()은 frontend에서 실행
  });
});

const sockets = []; // 누군가 서버에 연결시 그 connection을 넣어주는 배열
/*
wss.on("connection", (socket) => {
  sockets.push(socket); // ex)크롬으로 접속시 크롬을 배열에넣어줌
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  // socket.send("hello!!!"); // back -> front 로 보내기
  socket.on("message", (msg) => {
    const message = JSON.parse(msg); // parse : string을 object로 바꿔줌
    switch (message.type) {
      case "new_message":
        sockets.forEach(
          (aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`) // 메시지작성자 : 메시지내용
        );
      case "nickname":
        socket["nickname"] = message.payload; // nickname 속성을 socket에 추가
    }
  });
});
*/
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
