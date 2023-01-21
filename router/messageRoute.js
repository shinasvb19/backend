const express = require("express");
const router = express();
//const { verifyToken } = require("../middleware/verifyToken");
const {
  getMessages,
  addMessage,
  findChat,
} = require("../controller/messageController");

router.get("/:chatId", getMessages);
router.post("/", addMessage);

module.exports = router;
