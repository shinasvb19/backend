const express = require("express");
const {
  register,
  signin,
  block,
  unblock,
} = require("../controller/adminController");

const router = express.Router();
router.post("/", register);
router.post("/signin", signin);
router.post("/block", block);
router.post("/unblock", unblock);
// router.get("/find/:firstId/:secondId", findChat);
module.exports = router;
