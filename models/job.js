const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      trim: true,
    },

    jobTitle: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    workType: {
      type: String,
    },

    jobLocation: {
      type: String,
    },
    jobType: {
      type: String,
    },
    workExperience: {
      type: String,
    },
    jobDescription: {
      type: String,
    },
    anyOtherRequirements: {
      type: String,
    },
    skills: {
      type: String,
    },
    aplicants: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
