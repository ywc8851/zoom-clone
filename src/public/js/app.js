// front 와 back 연결
// socket : 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
  console.log("Connected to Server ✅");
}

// socket이 connection을 open 했을때 발생 => 서버랑 연결됐을 때
socket.addEventListener("open", handleOpen);
// 서버로부터 메시지를 받을때
socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});
// socket이 connection을 close 했을때 발생 => 서버랑 연결끊어졌을 때
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

setTimeout(() => {
  socket.send("hello from the browser!"); // front -> back 으로보내기
}, 10000);
