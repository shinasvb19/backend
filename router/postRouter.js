const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const verifyJwt = require("../middleware/verifyJwt");
router.get("/", verifyJwt, postController.getPosts);
router.post("/like", verifyJwt, postController.likePost);
router.post("/comment", verifyJwt, postController.commentPost);
router.get("/comment", verifyJwt, postController.commentGet);
router.post("/:id", postController.posts);


module.exports = router;
