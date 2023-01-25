const Job = require("../models/job");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { findById } = require("../models/job");
const User = require("../models/user");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  secure: true,
  service: "Gmail",
  auth: { user: "myofficial.shinas@gmail.com", pass: "aktamfzgfcvyfzdu" },
});
exports.jobPost = async (req, res) => {
  console.log(req.body.formOne.jobTitle);

  try {
    const newJob = new Job({
      userId: req.body.userId,
      jobTitle: req.body.formOne.jobTitle,
      company: req.body.formOne.company,
      workType: req.body.formOne.workType,
      jobLocation: req.body.formOne.jobLocation,
      jobType: req.body.formOne.jobType,
      workExperience: req.body.formTwo.workExperience,
      jobDescription: req.body.formTwo.jobDescription,
      anyOtherRequirements: req.body.formTwo.anyOtherRequirements,
      skills: req.body.formTwo.skills,
    });
    await newJob.save();
    res.status(200).json("done");
  } catch (err) {
    res.status(404);
  }
};

exports.getJobs = async (req, res) => {
  try {
    const job = await Job.find();
    res.status(200).json({ job });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
exports.applyJob = async (req, res) => {
  console.log(req.body);
  if (req.body.applyJob && req.body.userId) {
    const user = await User.findById(req.body.userId);
    let mailOption = {
      to: user.email,
      subject: "you successfully aplied to job",
      html: "your job application is succesfully submited. we will inform when the hirer aproves your application",
    };
    try {
      const aplicants = mongoose.Types.ObjectId(req.body.userId);
      const foundJob = await Job.findById({ _id: req.body.applyJob });
      // console.log(foundJob.aplicants.includes(aplicants));
      if (foundJob.aplicants.includes(aplicants)) {
        res.status(409).json("user already applied");
      } else {
        transporter.sendMail(mailOption, (err, info) => {
          if (err) {
            return console.log(err);
          } else {
            console.log("message sent", info.messageId);
          }
        });
        await Job.findByIdAndUpdate(
          { _id: req.body.applyJob },
          { $push: { aplicants: aplicants } }
        );
      }
    } catch (err) {
      res.status(404);
    }
  } else {
    res.status(401);
  }
};

exports.getJobAplications = async (req, res) => {
  try {
    const job = await Job.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "aplicants",
          foreignField: "_id",
          as: "foundUser",
        },
      },
    ]);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json(error);
  }
};
