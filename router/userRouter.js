const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const verifyJWT = require("../middleware/verifyJwt");
router.get("/", userController.landingPage);
// router.get("/posts", verifyJWT, userController.posts);
router.post("/register", userController.register);
router.post("/signin", userController.signin);
router.get("/users", verifyJWT, userController.userGet);
router.get("/profile", verifyJWT, userController.profile);
router.post("/otp/verify", verifyJWT, userController.otpVerify);
router.get("/profile/:id", verifyJWT, userController.allProfile);
router.delete("/:id", verifyJWT, userController.removeAccount);
router.get("/user/:id", verifyJWT, userController.user);
router.post("/follow/:id", verifyJWT, userController.followUser);
router.post("/unfollow/:id", verifyJWT, userController.unFollow);
module.exports = router;
