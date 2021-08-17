// 백앤드에서 작동
import express from "express";
import path from "path";
const __dirname = path.resolve();

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
// user가 /public으로 가게되면 __dirname + "/src/public" 폴더를 보여줌
app.use("/public", express.static(__dirname + "/src/public")); // public폴더를 유저에게 공개
// 내가만든 home을 render함
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // 주소창바꿔도 홈으로만가게함

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);
// express로 할일 : views를 설정해주고 render해줌
// 나머지는 websocket에서 실시간으로 일어남
