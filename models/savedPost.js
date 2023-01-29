const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const savedPostSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
    },
    posts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const SavedPost = mongoose.model("SavedPost", savedPostSchema);
module.exports = SavedPost;
