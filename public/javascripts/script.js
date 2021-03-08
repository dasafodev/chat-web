const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  console.log(msg)
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p>${item}</p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  ws.send({
    "message":message.value,
    "author":author.value
  });
  message.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

