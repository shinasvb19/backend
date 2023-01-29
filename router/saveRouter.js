const express = require("express");
const verifyJWT = require("../middleware/verifyJwt");
const { postsSaved } = require("../controller/savePostController");

const router = express.Router();

router.post("/", verifyJWT, postsSaved);

module.exports = router;
