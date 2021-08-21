/* // frontend에서 작동
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
 */
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true; // 채팅방 들어가기전에 화면에 나타내지 않음

let roomName;
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  // 백앤드로 메시지보내기  new_message이벤트보내기
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false; // 채팅방 들어가면 화면에 나타냄
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`; // 방제목변경
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");

  /* 
  emit 첫번째인자 : event 이름 , 두번째인자 : 보내고싶은 payload , 세번째인자 : 서버에서 호출하는 function(끝날때실행) 
  emit하면 argument(여기선 object)를 보낼수있음, string으로 변환필요없음
  */
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;

  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("someone joined!");
});

socket.on("bye", () => {
  addMessage("someone left ㅠㅠ");
});

// 새로운 메시지 받기
socket.on("new_message", addMessage);
