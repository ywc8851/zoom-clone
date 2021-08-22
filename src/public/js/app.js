const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  // 백앤드로 메시지보내기  new_message이벤트보내기
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = form.querySelector("#roomName");
  const nickNameInput = form.querySelector("#name");
  /* 
  emit 첫번째인자 : event 이름 , 두번째인자 : 보내고싶은 payload , 세번째인자 : 서버에서 호출하는 function(끝날때실행) 
  emit하면 argument(여기선 object)를 보낼수있음, string으로 변환필요없음
  */
  socket.emit("enter_room", roomNameInput.value, nickNameInput.value, showRoom);
  roomName = roomNameInput.value;
  //roomName = input.value;
  roomNameInput.value = "";
  const changeNameInput = room.querySeslector("#name input");
  changeNameInput.value = nickNameInput.value;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left ㅠㅠ`);
});

// 새로운 메시지 받기
socket.on("new_message", addMessage);

/* socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
}); */
