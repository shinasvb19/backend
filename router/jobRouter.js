const express = require("express");

const router = express.Router();
const {
  jobPost,
  getJobs,
  applyJob,
  getJobAplications,
} = require("../controller/jobController");

router.post("/", jobPost);
router.get("/", getJobs);
router.get("/application/:id", getJobAplications);
router.post("/apply", applyJob);
module.exports = router;
