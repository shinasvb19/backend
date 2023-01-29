const express = require("express");

const router = express.Router();
const {
  jobPost,
  getJobs,
  applyJob,
  getJobAplications,
} = require("../controller/jobController");
const verifyJWT = require("../middleware/verifyJwt");

router.post("/", verifyJWT, jobPost);
router.get("/", verifyJWT, getJobs);
router.get("/application/:id", verifyJWT, getJobAplications);
router.post("/apply", verifyJWT, applyJob);
module.exports = router;
