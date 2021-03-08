
const WebSocket = require("ws");
const Message = require("./models/message");


const clients = [];
let messages = [];

const wsConnection = async (server) => {
  await Message.findAll().then(result => messages = result.map(value => value.message))
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      messages.push(message);
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;