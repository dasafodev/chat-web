const WebSocket = require("ws");
const Message = require("./models/message");

const clients = [];
let messages = [];

const wsConnection =  (server) => {
   Message.findAll().then((result) => {
    return (messages = result.map((value) => {
      return { message: value["message"], author: value["author"] };
    }));
  });
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      let jsonItem = JSON.parse(message);
      Message.create({
        message: jsonItem["message"],
        author: jsonItem["author"],
      }).then((value) => {
        messages.push(jsonItem);
        sendMessages();
      });
    });
  });
};
const sendMessages =  ()  => {
   Message.findAll().then((result) => {
    messages = result.map((value) => {
      return { message: value["message"], author: value["author"] };
    })
    clients.forEach(client => client.send(JSON.stringify(messages)))
  });
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
