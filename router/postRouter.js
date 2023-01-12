const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
router.get("/", postController.getPosts);
router.post("/like", postController.likePost);
router.post("/comment", postController.commentPost);
router.get("/comment", postController.commentGet);
router.post("/:id", postController.posts);

module.exports = router;
