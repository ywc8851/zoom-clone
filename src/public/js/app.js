// frontend에서 작동
// socket : 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
function handleOpen() {
  console.log("Connected to Server ✅");
}

// socket이 connection을 open 했을때 발생 => 서버랑 연결됐을 때
socket.addEventListener("open", handleOpen);

// 서버로부터 메시지를 받을때 -> 메시지를 화면에 보여줌
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data; // li안에 message 내용 넣기
  messageList.append(li);
});

// socket이 connection을 close 했을때 발생 => 서버랑 연결끊어졌을 때
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

function makeMessage(type, payload) {
  // 서버에 보내기 위해 메시지 만들기
  const msg = { type, payload };
  return JSON.stringify(msg); // object를 string으로 변환
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  //socket.send(input.value); // 프론트의 form에서 back으로 보냄
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
