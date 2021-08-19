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

function onSocketMessage(message) {
  console.log(message);
}
wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", onSocketMessage);
  socket.send("hello!!!"); // back -> front 로 보내기
});

server.listen(3000, handleListen);
