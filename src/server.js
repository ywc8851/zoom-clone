// express로 할일 : views를 설정해주고 render해줌
// 나머지는 websocket에서 실시간으로 일어남
// 백앤드에서 작동
import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
// user가 /public으로 가게되면 __dirname + "/src/public" 폴더를 보여줌
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// 위의 두줄로 http 서버, websocket 서버 둘다작동가능

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

const sockets = []; // 누군가 서버에 연결시 그 connection을 넣어주는 배열

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

server.listen(3000, handleListen);
