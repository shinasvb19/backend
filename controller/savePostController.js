const { findByIdAndUpdate } = require("../models/savedPost");
const SavedPost = require("../models/savedPost");

exports.postsSaved = async (req, res) => {
  console.log("here it is mate", req.body.postSave);
  if (req.body.postSave === undefined) {
    res.status(500);
  } else {
    const foundItem = await SavedPost.findOne({ userId: req.id });

    //   console.log(foundItem.posts.includes(req.body.posts));
    if (foundItem?.posts.includes(req.body.postSave)) {
      res.status(409).json("already exists");
    } else if (foundItem) {
      await SavedPost.findByIdAndUpdate(
        { _id: foundItem._id },

        { $push: { posts: req.body.postSave } }
      );
      console.log("waaawawawawa");
      res.status(200).json("success");
    } else {
      console.log("here is this thing");
      const post = new SavedPost({
        userId: req.id,
      });
      post.posts.push(req.body.postSave);
      await post.save();
      res.status(200).json("successfully created");
    }
  }
};
