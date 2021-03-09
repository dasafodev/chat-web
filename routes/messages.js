var express = require('express');
var router = express.Router();
const ws = require("./../wslib")
const Joi = require("joi");
const Message = require("../models/message");

/* GET messages listing. */
router.get('/', (req, res) =>Message.findAll().then(result => res.send(result)));

router.get("/:id", (req, res) => {
  Message.findByPk(req.params.id).then((response) => {
    if (response === null)
      return res
        .status(404)
        .send("The message with the given id was not found.");
    res.send(response);
  });
});

router.post("/", function (req, res, next) {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  Message.create({ message: req.body.message, author: req.body.author }).then(
    (result) => {
      ws.sendMessages()
      // ws.send(result.message)
      // Message.findAll().then(newResult => {
      //   // renderMessages(newResult.map(value => value.message));
      // })
      res.send(result);
    }
  );
  // renderMessages(  Message.findAll().then(result => result.map(value => value.message)));
});

router.put("/:id", (req, res) => {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  Message.update(req.body, { where: { id: req.params.id } }).then((response) => {
    if (response[0] !== 0) res.send({ message: "Message updated" });
    else res.status(404).send({ message: "Message was not found" });
  });
});

router.delete("/:id", (req, res) => {
  Message.destroy({
    where: {
      id: req.params.id,
    },
  }).then((response) => {
    if (response === 1) res.status(204).send();
    else res.status(404).send({ message: "Message was not found" });
  });
});


const validateMessage = (message) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string().required().trim().custom((value, helpers)=>{
      if(value.split(' ').length != 2){
        return helpers.error('El autor debe tener nombre y apellido separados por un espacio')
      }
      return value
    },'custome validation')
  });

  return schema.validate(message);
};

module.exports = router;
