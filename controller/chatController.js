const Chat = require("../models/chat");

exports.createChat = async (req, res) => {
  //   console.log("woooooowoowowowowos");
  console.log(req.body);
  if (req.body.id === req.body.user) {
    res.status(500);
  } else {
    const chat = await Chat.findOne({
      members: [req.body.id, req.body.user],
    });
    if (chat) {
      res.status(409).json("user alredy exists");
    } else {
      console.log("what wierd", chat);

      const newChat = new Chat({
        members: [req.body.id, req.body.user],
      });
      try {
        const result = await newChat.save();
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }
};

exports.userChats = async (req, res) => {
  console.log(req.params);
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.findChat = async (req, res) => {
  console.log("ckiiaa");
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
};
