const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const verifyJWT = require("../middleware/verifyJwt");
router.get("/", userController.landingPage);
router.get("/posts", userController.posts);
router.post("/register", userController.register);
router.post("/signin", userController.signin);
router.get("/users", userController.userGet);
router.get("/profile", userController.profile);

router.delete("/:id", userController.removeAccount);
router.get("/follow/:id", userController.followUser);
router.get("/unfollow/:id", userController.unFollow);
module.exports = router;
